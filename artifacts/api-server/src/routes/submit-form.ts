import { readFile, rm } from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import type { Request, Response } from "express";
import { Router, type IRouter } from "express";
import formidable, { type Fields, type File, type Files } from "formidable";
import { Resend } from "resend";
import {
  dispatchConversion,
  type ConversionDispatchInput,
  type ConversionStatus,
} from "../lib/conversion-dispatch";

const router: IRouter = Router();

const BUSINESS_EMAIL = "wrivard@kua.quebec";
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_FILES = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const RATE_LIMIT_MAX_REQUESTS = 3;
const MIN_FILL_MS = 3_000;
const MARKETING_CONSENT_VERSION = "cookiebot-2026-08-25";
const MAX_MESSAGE_LENGTH = 2_000;
const MAX_NAME_LENGTH = 80;
const QUARANTINE_MAX_ENTRIES = 200;
/* Les trois premiers libellés viennent du tunnel publicitaire, les suivants du
   formulaire de /soumission. La liste doit rester alignée sur celle du
   composant QuoteForm : un libellé absent d'ici est rejeté. */
const ALLOWED_SERVICES = new Set([
  "Rénovation de sous-sol",
  "Rénovation de salle de bain",
  "Rénovation de cuisine",
  "Travaux extérieurs",
  "Agrandissement",
  "Construction neuve",
  "Construction de garage",
  "Projet commercial",
  "Projet industriel",
]);
/* Pages du tunnel publicitaire pouvant être annoncées comme provenance d'une
   demande. La liste doit rester alignée sur `paidPageSlugs`
   (artifacts/slc-habitation/src/lib/paid-pages.ts) : une valeur inconnue est
   ignorée plutôt que reportée dans le courriel. */
const ALLOWED_PAID_PAGES = new Set([
  "/pub/renovation-sous-sol",
  "/pub/renovation-salle-de-bain",
  "/pub/renovation-cuisine",
  "/pub/agrandissement-maison",
]);
/* Compléments demandés au visiteur depuis le formulaire publicitaire. Ils sont
   facultatifs côté serveur : une valeur absente ou inconnue est simplement
   ignorée, jamais un motif de rejet, pour qu'un client plus ancien continue
   d'être accepté. */
const ALLOWED_PROJECT_CITIES = new Set([
  "Laval",
  "Saint-Eustache",
  "Terrebonne",
  "Sainte-Thérèse",
  "Rosemère",
  "Mirabel",
  "Boisbriand",
  "Blainville",
  "Saint-Jérôme",
  "Autre municipalité",
]);
const ALLOWED_PROJECT_TIMELINES = new Set([
  "Dès que possible",
  "Dans les 3 prochains mois",
  "Dans 3 à 6 mois",
  "Dans plus de 6 mois",
  "Je ne sais pas encore",
]);
const ALLOWED_REFERRAL_SOURCES = new Set([
  "Recherche Google",
  "Publicité en ligne",
  "Recommandation d’un proche",
  "Réseaux sociaux",
  "Nous avons déjà fait affaire ensemble",
  "Autre",
]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestCounts = new Map<string, { count: number; resetAt: number }>();
type ProcessedSubmission = {
  processedAt: number;
  conversionStatus: ConversionStatus;
  marketingConsent: boolean;
  conversionInput: ConversionDispatchInput;
};

const processedSubmissions = new Map<string, ProcessedSubmission>();
const activeSubmissions = new Map<string, Promise<void>>();
const quarantine: Array<{ reason: string; timestamp: string; sourceFingerprint: string }> = [];
const budgetLabels: Record<string, string> = {
  "Contact 6 Radio 1": "25 000 $ et moins",
  "Contact 6 Radio 2": "25 000 $ – 50 000 $",
  "Contact 6 Radio 3": "50 000 $ – 100 000 $",
  "Contact 6 Radio 4": "100 000 $ et plus",
};
const disposableDomains = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "yopmail.com",
  "10minutemail.com",
  "tempmail.com",
  "trashmail.com",
]);
const urlPattern = /(?:https?:\/\/|www\.|\[url(?:=|\]))/i;
const northAmericanPhonePattern = /^(?:\+?1[\s.-]?)?(?:\(?[2-9]\d{2}\)?[\s.-]?)?[2-9]\d{2}[\s.-]?\d{4}$/;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SUBMISSION_TTL_MS = 24 * 60 * 60 * 1000;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

/** Ne conserve la réponse que si elle fait partie des choix proposés. */
function allowedChoice(value: string | undefined, choices: Set<string>) {
  return value && choices.has(value) ? value : undefined;
}

function sanitizedValue(fields: Fields, key: string, maxLength = 300) {
  const value = firstValue(fields[key]);
  if (typeof value !== "string") return undefined;
  return value.replace(/[\u0000-\u001F\u007F]/g, "").trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]!,
  );
}

function fileList(value: File | File[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function clientAddress(req: Request) {
  return req.ip || req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() || "unknown";
}

function sourceFingerprint(req: Request) {
  return createHash("sha256").update(clientAddress(req)).digest("hex").slice(0, 24);
}

function consumeRateLimit(key: string) {
  const now = Date.now();
  for (const [existingKey, value] of requestCounts) {
    if (value.resetAt <= now) requestCounts.delete(existingKey);
  }
  const current = requestCounts.get(key);
  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  current.count += 1;
  return true;
}

function pruneProcessedSubmissions(now: number) {
  for (const [submissionId, submission] of processedSubmissions) {
    if (submission.processedAt + SUBMISSION_TTL_MS <= now) {
      processedSubmissions.delete(submissionId);
    }
  }
}

function recordRejection(req: Request, reason: string) {
  quarantine.push({
    reason,
    timestamp: new Date().toISOString(),
    sourceFingerprint: sourceFingerprint(req),
  });
  if (quarantine.length > QUARANTINE_MAX_ENTRIES) quarantine.splice(0, quarantine.length - QUARANTINE_MAX_ENTRIES);
  req.log.warn({ reason }, "Quote form rejected");
}

function reject(req: Request, res: Response, reason: string, message: string, status = 400) {
  recordRejection(req, reason);
  res.status(status).json({ success: false, error: { code: reason, message } });
}

function parseStartedAt(value: string | undefined) {
  if (!value || !/^\d{10,13}$/.test(value)) return undefined;
  const milliseconds = Number(value.length === 10 ? `${value}000` : value);
  return Number.isSafeInteger(milliseconds) ? milliseconds : undefined;
}

async function verifyTurnstile(token: string | undefined, req: Request) {
  // Local development and tests may run without Cloudflare credentials. Production
  // rejects such configuration explicitly below; it never silently bypasses this check.
  if (!process.env.TURNSTILE_SECRET_KEY) return process.env.NODE_ENV !== "production";
  if (!token) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: clientAddress(req),
      }),
      signal: AbortSignal.timeout(5_000),
    });
    const result: unknown = await response.json();
    return typeof result === "object" && result !== null && "success" in result && result.success === true;
  } catch {
    return false;
  }
}

function parseRequest(req: Request): Promise<[Fields, Files]> {
  const form = formidable({
    maxFileSize: MAX_FILE_SIZE,
    maxFiles: MAX_FILES,
    keepExtensions: true,
    uploadDir: "/tmp",
  });

  return new Promise<[Fields, Files]>((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve([fields, files]);
    });
  });
}

router.post("/submit-form", async (req: Request, res: Response): Promise<void> => {
  let uploadedFiles: File[] = [];
  let activeSubmissionId: string | undefined;
  let activeSubmissionPromise: Promise<void> | undefined;
  let finishActiveSubmission: (() => void) | undefined;

  try {
    const idempotencyHeader = req.header("idempotency-key");
    const requestedSubmissionId =
      idempotencyHeader && uuidPattern.test(idempotencyHeader)
        ? idempotencyHeader
        : undefined;
    pruneProcessedSubmissions(Date.now());
    const previousSubmission = requestedSubmissionId
      ? processedSubmissions.get(requestedSubmissionId)
      : undefined;
    if (requestedSubmissionId && previousSubmission) {
      let conversionStatus = previousSubmission.conversionStatus;
      if (
        previousSubmission.marketingConsent &&
        (conversionStatus === "pending" || conversionStatus === "failed")
      ) {
        conversionStatus = await dispatchConversion(previousSubmission.conversionInput);
        previousSubmission.conversionStatus = conversionStatus;
      }
      res.status(200).json({
        success: true,
        message: "Votre demande a déjà été reçue.",
        submissionId: requestedSubmissionId,
        conversionStatus,
      });
      return;
    }

    if (!consumeRateLimit(sourceFingerprint(req))) {
      reject(req, res, "rate_limited", "Trop de demandes. Veuillez réessayer dans quelques minutes.", 429);
      return;
    }

    const [fields, files] = await parseRequest(req);
    const firstName = sanitizedValue(fields, "Contact-6-First-Name", MAX_NAME_LENGTH);
    const lastName = sanitizedValue(fields, "Contact-6-Last-Name", MAX_NAME_LENGTH);
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    const email = sanitizedValue(fields, "Contact-6-Email", 160)?.toLowerCase();
    const phone = sanitizedValue(fields, "Contact-6-Phone", 24);
    const service = sanitizedValue(fields, "Contact-6-Select", 100);
    const budget = sanitizedValue(fields, "Contact-6-Radio", 100);
    const projectCity = allowedChoice(sanitizedValue(fields, "project_city", 60), ALLOWED_PROJECT_CITIES);
    const projectTimeline = allowedChoice(
      sanitizedValue(fields, "project_timeline", 60),
      ALLOWED_PROJECT_TIMELINES,
    );
    const referralSource = allowedChoice(
      sanitizedValue(fields, "referral_source", 60),
      ALLOWED_REFERRAL_SOURCES,
    );
    const rawMessage = firstValue(fields["Contact-6-Message"]);
    const message = sanitizedValue(fields, "Contact-6-Message", MAX_MESSAGE_LENGTH + 1);
    const honeypot = sanitizedValue(fields, "company_website") ?? sanitizedValue(fields, "Contact-6-Website");
    const startedAt = parseStartedAt(sanitizedValue(fields, "startedAt") ?? sanitizedValue(fields, "renderedAt"));
    const consentText = sanitizedValue(fields, "consent_text", 2_000) ?? sanitizedValue(fields, "consentText", 2_000);
    const consentVersion = sanitizedValue(fields, "consent_version", 80) ?? sanitizedValue(fields, "consentVersion", 80);
    const consent = sanitizedValue(fields, "consent_contact") ?? sanitizedValue(fields, "consentContact");
    const consentMarketing = sanitizedValue(fields, "consent_marketing", 5) === "true";
    const consentMarketingVersion = sanitizedValue(fields, "consent_marketing_version", 80);
    const turnstileToken = sanitizedValue(fields, "turnstileToken", 4_000) ?? sanitizedValue(fields, "cf-turnstile-response", 4_000);
    const sourcePage =
      sanitizedValue(fields, "source_page") || sanitizedValue(fields, "Contact-6-Source-Page");
    const attributionCapturedAt = sanitizedValue(fields, "attribution_captured_at", 40);
    const attributionLandingPage = sanitizedValue(fields, "attribution_landing_page", 300);
    const declaredPaidPage = sanitizedValue(fields, "paid_page", 300);
    const paidPage =
      declaredPaidPage && ALLOWED_PAID_PAGES.has(declaredPaidPage) ? declaredPaidPage : undefined;
    const utmSource = sanitizedValue(fields, "utm_source", 255);
    const utmMedium = sanitizedValue(fields, "utm_medium", 255);
    const utmCampaign = sanitizedValue(fields, "utm_campaign", 255);
    const utmTerm = sanitizedValue(fields, "utm_term", 255);
    const utmContent = sanitizedValue(fields, "utm_content", 255);
    const gclid = sanitizedValue(fields, "gclid", 255);
    const gbraid = sanitizedValue(fields, "gbraid", 255);
    const wbraid = sanitizedValue(fields, "wbraid", 255);
    const gadSource = sanitizedValue(fields, "gad_source", 255);
    const gadCampaignId = sanitizedValue(fields, "gad_campaignid", 255);
    uploadedFiles = [
      ...fileList(files["Contact-6-Image[]"]),
      ...fileList(files["Contact-6-Image"]),
    ];

    if (honeypot) {
      reject(req, res, "honeypot", "La demande ne peut pas être traitée.");
      return;
    }
    if (!startedAt || Date.now() - startedAt < MIN_FILL_MS || startedAt > Date.now() + 60_000) {
      reject(req, res, "too_fast", "Veuillez prendre un moment avant d’envoyer le formulaire.");
      return;
    }
    if (!fullName || !email || !phone || !message || !service || !budget) {
      reject(req, res, "required_fields", "Tous les champs obligatoires doivent être remplis.");
      return;
    }
    if (!emailPattern.test(email) || email.length > 160) {
      reject(req, res, "invalid_email", "Adresse courriel invalide.");
      return;
    }
    if (disposableDomains.has(email.split("@")[1] ?? "")) {
      reject(req, res, "disposable_email", "Veuillez utiliser une adresse courriel permanente.");
      return;
    }
    if (!northAmericanPhonePattern.test(phone)) {
      reject(req, res, "invalid_phone", "Veuillez inscrire un numéro de téléphone nord-américain valide.");
      return;
    }
    if (fullName.length > MAX_NAME_LENGTH * 2 + 1 || !/^[\p{L}\p{M}' -]+$/u.test(fullName)) {
      reject(req, res, "invalid_name", "Veuillez inscrire un nom valide.");
      return;
    }
    if (
      typeof rawMessage !== "string" ||
      rawMessage.length > MAX_MESSAGE_LENGTH ||
      message.length < 10 ||
      urlPattern.test(message)
    ) {
      reject(req, res, "invalid_message", "Le message doit compter entre 10 et 2 000 caractères et ne peut pas contenir de lien.");
      return;
    }
    if (!ALLOWED_SERVICES.has(service)) {
      reject(req, res, "invalid_service", "Veuillez sélectionner un service valide.");
      return;
    }
    if (!(budget in budgetLabels)) {
      reject(req, res, "invalid_budget", "Veuillez sélectionner une fourchette de budget valide.");
      return;
    }
    if (consent !== "true" || !consentText || !consentVersion) {
      reject(req, res, "consent_required", "Votre consentement explicite et la version du consentement sont requis.");
      return;
    }
    if (
      consentMarketing &&
      consentMarketingVersion !== MARKETING_CONSENT_VERSION
    ) {
      reject(
        req,
        res,
        "invalid_marketing_consent",
        "Le consentement publicitaire ne peut pas être vérifié.",
      );
      return;
    }
    if (!process.env.TURNSTILE_SECRET_KEY && process.env.NODE_ENV === "production") {
      req.log.error("Turnstile is not configured in production");
      res.status(503).json({ success: false, error: { code: "security_unavailable", message: "Le formulaire est temporairement indisponible. Veuillez réessayer plus tard." } });
      return;
    }
    if (!(await verifyTurnstile(turnstileToken, req))) {
      reject(req, res, "turnstile_failed", "La vérification de sécurité a échoué. Veuillez réessayer.");
      return;
    }

    const invalidFile = uploadedFiles.find(
      (file) => !file.mimetype?.toLowerCase().startsWith("image/"),
    );
    const totalFileSize = uploadedFiles.reduce((total, file) => total + (file.size || 0), 0);
    if (uploadedFiles.length > MAX_FILES || invalidFile || totalFileSize > 4.5 * 1024 * 1024) {
      reject(
        req,
        res,
        "invalid_files",
        "Les fichiers doivent être des images (maximum cinq) de 4,5 Mo ou moins au total.",
        413,
      );
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      req.log.warn("Quote form received without Resend configuration");
      res.status(503).json({
        success: false,
        error: {
          code: "email_unavailable",
          message: "Le formulaire est temporairement indisponible. Veuillez nous contacter par téléphone.",
        },
      });
      return;
    }

    const formSubmissionId = sanitizedValue(fields, "submission_id", 36);
    const submissionId =
      requestedSubmissionId ??
      (formSubmissionId && uuidPattern.test(formSubmissionId)
        ? formSubmissionId
        : randomUUID());
    const existingSubmission = activeSubmissions.get(submissionId);
    if (existingSubmission) {
      await existingSubmission;
      const completedSubmission = processedSubmissions.get(submissionId);
      if (completedSubmission) {
        res.status(200).json({
          success: true,
          message: "Votre demande a déjà été reçue.",
          submissionId,
          conversionStatus: completedSubmission.conversionStatus,
        });
      } else {
        res.status(503).json({
          success: false,
          error: {
            code: "email_unavailable",
            message: "Le formulaire est temporairement indisponible. Veuillez nous contacter par téléphone.",
          },
        });
      }
      return;
    }

    activeSubmissionId = submissionId;
    activeSubmissionPromise = new Promise<void>((resolve) => {
      finishActiveSubmission = resolve;
    });
    activeSubmissions.set(submissionId, activeSubmissionPromise);

    const attachments = await Promise.all(
      uploadedFiles.map(async (file) => ({
        filename:
          file.originalFilename?.replace(/[^a-zA-Z0-9.-]/g, "_") ??
          "image-projet.jpg",
        content: await readFile(file.filepath),
      })),
    );

    const detailRows = [
      ["Nom complet", fullName],
      ["Courriel", email],
      ["Téléphone", phone],
      ["Service", service],
      ["Budget", budget ? budgetLabels[budget] ?? budget : undefined],
      ["Ville du projet", projectCity],
      ["Échéancier souhaité", projectTimeline],
      ["Nous a connus par", referralSource],
      ["Version du consentement", consentVersion],
      ["Texte du consentement", consentText],
      ["Consentement marketing", consentMarketing ? "accordé" : "refusé"],
      ["Version du consentement marketing", consentMarketingVersion],
      ["Page d’origine", sourcePage],
      ["Attribution captée le", attributionCapturedAt],
      ["Page d’atterrissage publicitaire", attributionLandingPage],
      ["Page publicitaire d’origine", paidPage],
      ["UTM source", utmSource],
      ["UTM medium", utmMedium],
      ["UTM campaign", utmCampaign],
      ["UTM term", utmTerm],
      ["UTM content", utmContent],
      ["Google Click ID", consentMarketing ? gclid : undefined],
      ["Google BRAID", consentMarketing ? gbraid : undefined],
      ["Google WBRAID", consentMarketing ? wbraid : undefined],
      ["Google source", gadSource],
      ["Google campaign ID", gadCampaignId],
    ]
      .filter(([, value]) => Boolean(value))
      .map(
        ([label, value]) =>
          `<tr><td style="padding:8px 12px 8px 0;font-weight:700">${label}</td><td style="padding:8px 0">${escapeHtml(value!)}</td></tr>`,
      )
      .join("");

    const businessHtml = `<!doctype html><html lang="fr"><body style="font-family:Arial,sans-serif;color:#232323"><h1 style="color:#0b0b0b">Nouvelle demande de soumission</h1><table>${detailRows}</table><h2 style="color:#0b0b0b">Message</h2><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(message)}</p>${attachments.length ? `<p>${attachments.length} image(s) jointe(s).</p>` : ""}</body></html>`;
    const from = process.env.FROM_EMAIL || "noreply@kua.quebec";
    const resend = new Resend(process.env.RESEND_API_KEY);

    const businessResult = await resend.emails.send({
      from,
      to: BUSINESS_EMAIL,
      replyTo: email,
      subject: `Nouvelle soumission — ${fullName}`,
      html: businessHtml,
      attachments,
    });

    if (businessResult.error) {
      req.log.error("Unable to send quote email");
      res.status(502).json({
        success: false,
        error: { code: "email_delivery_failed", message: "Une erreur est survenue. Veuillez réessayer plus tard." },
      });
      return;
    }

    const conversionInput: ConversionDispatchInput = {
      submissionId,
      marketingConsentVersion:
        consentMarketingVersion ?? MARKETING_CONSENT_VERSION,
      gclid,
      gbraid,
      wbraid,
      gadSource,
      gadCampaignId,
    };
    processedSubmissions.set(submissionId, {
      processedAt: Date.now(),
      conversionStatus: consentMarketing ? "pending" : "consent_denied",
      marketingConsent: consentMarketing,
      conversionInput,
    });
    try {
      const confirmationResult = await resend.emails.send({
        from, to: email, replyTo: BUSINESS_EMAIL,
        subject: "Nous avons reçu votre demande de soumission",
        html: `<p>Bonjour ${escapeHtml(firstName || fullName)},</p><p>Merci pour votre demande. L’équipe de SLC Habitation vous répondra sous peu.</p>`,
      });
      if (confirmationResult.error) req.log.warn("Quote confirmation email could not be sent");
    } catch {
      req.log.warn("Quote confirmation email could not be sent");
    }
    let conversionStatus: ConversionStatus = consentMarketing
      ? "unavailable"
      : "consent_denied";
    if (consentMarketing) {
      try {
        conversionStatus = await dispatchConversion(conversionInput);
        if (conversionStatus === "failed") req.log.warn({ conversionStatus }, "Conversion dispatch failed");
      } catch {
        conversionStatus = "failed";
        req.log.warn({ conversionStatus }, "Conversion dispatch failed");
      }
    }
    const processedSubmission = processedSubmissions.get(submissionId);
    if (processedSubmission) processedSubmission.conversionStatus = conversionStatus;

    res.status(200).json({
      success: true,
      message: "Votre demande a été envoyée avec succès.",
      submissionId,
      conversionStatus,
    });
  } catch (error: unknown) {
    const code = typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";
    const message = error instanceof Error ? error.message : "";

    if (
      code === "LIMIT_FILE_SIZE" ||
      code === "LIMIT_FILE_COUNT" ||
      message.includes("maxFileSize") ||
      message.includes("maxFiles")
    ) {
      res.status(413).json({
        success: false,
        error: {
          code: "file_too_large",
          message: "Les images sont trop volumineuses. Veuillez réduire leur taille ou en sélectionner moins.",
        },
      });
      return;
    }

    req.log.error({ code }, "Quote form submission failed");
    res.status(500).json({
      success: false,
      error: { code: "internal_error", message: "Erreur interne du serveur. Veuillez réessayer plus tard." },
    });
  } finally {
    finishActiveSubmission?.();
    if (
      activeSubmissionId &&
      activeSubmissionPromise &&
      activeSubmissions.get(activeSubmissionId) === activeSubmissionPromise
    ) {
      activeSubmissions.delete(activeSubmissionId);
    }
    await Promise.all(
      uploadedFiles.map((file) => rm(file.filepath, { force: true }).catch(() => undefined)),
    );
  }
});

export default router;