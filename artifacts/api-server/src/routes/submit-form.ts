import { readFile, rm } from "node:fs/promises";
import type { Request, Response } from "express";
import { Router, type IRouter } from "express";
import formidable, { type Fields, type File, type Files } from "formidable";
import { Resend } from "resend";

const router: IRouter = Router();

const BUSINESS_EMAIL = "wrivard@kua.quebec";
const MAX_FILE_SIZE = 4 * 1024 * 1024;
const MAX_FILES = 5;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const ALLOWED_SERVICES = new Set([
  "Rénovation de sous-sol",
  "Rénovation de salle de bain",
  "Rénovation de cuisine",
]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function trackedValue(fields: Fields, key: string) {
  return firstValue(fields[key])?.trim().slice(0, 300);
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

function consumeRateLimit(key: string) {
  const now = Date.now();
  const current = requestCounts.get(key);
  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) return false;
  current.count += 1;
  return true;
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

router.post("/submit-form", async (req: Request, res: Response) => {
  let uploadedFiles: File[] = [];

  try {
    if (!consumeRateLimit(clientAddress(req))) {
      res.status(429).json({
        success: false,
        message: "Trop de demandes. Veuillez réessayer dans une minute.",
      });
      return;
    }

    const [fields, files] = await parseRequest(req);
    const firstName = firstValue(fields["Contact-6-First-Name"]);
    const lastName = firstValue(fields["Contact-6-Last-Name"]);
    const fullName = `${firstName ?? ""} ${lastName ?? ""}`.trim();
    const email = firstValue(fields["Contact-6-Email"])?.trim();
    const phone = firstValue(fields["Contact-6-Phone"])?.trim();
    const submittedService = firstValue(fields["Contact-6-Select"])?.trim();
    const service =
      submittedService && ALLOWED_SERVICES.has(submittedService)
        ? submittedService
        : "Général";
    const budget = firstValue(fields["Contact-6-Radio"])?.trim();
    const message = firstValue(fields["Contact-6-Message"])?.trim();
    const honeypot = firstValue(fields["Contact-6-Website"])?.trim();
    const sourcePage =
      trackedValue(fields, "source_page") ||
      trackedValue(fields, "Contact-6-Source-Page");
    const utmSource = trackedValue(fields, "utm_source");
    const utmMedium = trackedValue(fields, "utm_medium");
    const utmCampaign = trackedValue(fields, "utm_campaign");
    const utmTerm = trackedValue(fields, "utm_term");
    const utmContent = trackedValue(fields, "utm_content");
    const gclid = trackedValue(fields, "gclid");
    const gbraid = trackedValue(fields, "gbraid");
    const wbraid = trackedValue(fields, "wbraid");
    uploadedFiles = [
      ...fileList(files["Contact-6-Image[]"]),
      ...fileList(files["Contact-6-Image"]),
    ];

    if (!fullName || !email || !message) {
      res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis.",
      });
      return;
    }

    if (honeypot) {
      res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis.",
      });
      return;
    }

    if (!emailPattern.test(email)) {
      res.status(400).json({ success: false, message: "Adresse email invalide." });
      return;
    }

    const invalidFile = uploadedFiles.find(
      (file) => !file.mimetype?.toLowerCase().startsWith("image/"),
    );
    const totalFileSize = uploadedFiles.reduce((total, file) => total + (file.size || 0), 0);
    if (invalidFile || totalFileSize > 4.5 * 1024 * 1024) {
      res.status(413).json({
        success: false,
        message: "Les fichiers doivent être des images de 4,5 Mo ou moins au total.",
      });
      return;
    }

    if (!process.env.RESEND_API_KEY) {
      req.log.warn("Quote form received without Resend configuration");
      res.status(503).json({
        success: false,
        message:
          "Le formulaire est temporairement indisponible. Veuillez nous contacter par téléphone.",
      });
      return;
    }

    const budgetLabels: Record<string, string> = {
      "Contact 6 Radio 1": "25 000 $ et moins",
      "Contact 6 Radio 2": "25 000 $ – 50 000 $",
      "Contact 6 Radio 3": "50 000 $ – 100 000 $",
      "Contact 6 Radio 4": "100 000 $ et plus",
    };

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
      ["Page d’origine", sourcePage],
      ["UTM source", utmSource],
      ["UTM medium", utmMedium],
      ["UTM campaign", utmCampaign],
      ["UTM term", utmTerm],
      ["UTM content", utmContent],
      ["Google Click ID", gclid],
      ["Google BRAID", gbraid],
      ["Google WBRAID", wbraid],
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
      req.log.error({ error: businessResult.error }, "Unable to send quote email");
      res.status(502).json({
        success: false,
        message: "Une erreur est survenue. Veuillez réessayer plus tard.",
      });
      return;
    }

    const confirmationResult = await resend.emails.send({
      from,
      to: email,
      replyTo: BUSINESS_EMAIL,
      subject: "Nous avons reçu votre demande de soumission",
      html: `<p>Bonjour ${escapeHtml(firstName || fullName)},</p><p>Merci pour votre demande. L’équipe de SLC Habitation vous répondra sous peu.</p>`,
    });

    if (confirmationResult.error) {
      req.log.warn(
        { error: confirmationResult.error },
        "Quote confirmation email could not be sent",
      );
    }

    res.status(200).json({
      success: true,
      message: "Votre demande a été envoyée avec succès.",
    });
  } catch (error: unknown) {
    const code = typeof error === "object" && error && "code" in error
      ? String(error.code)
      : "";
    const message = error instanceof Error ? error.message : "";

    if (code === "LIMIT_FILE_SIZE" || message.includes("maxFileSize")) {
      res.status(413).json({
        success: false,
        message:
          "Les images sont trop volumineuses. Veuillez réduire leur taille ou en sélectionner moins.",
      });
      return;
    }

    req.log.error({ error }, "Quote form submission failed");
    res.status(500).json({
      success: false,
      message: "Erreur interne du serveur. Veuillez réessayer plus tard.",
    });
  } finally {
    await Promise.all(
      uploadedFiles.map((file) => rm(file.filepath, { force: true }).catch(() => undefined)),
    );
  }
});

export default router;