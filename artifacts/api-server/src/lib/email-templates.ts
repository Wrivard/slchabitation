/**
 * Courriels envoyés après une demande de soumission : l'accusé de réception du
 * client et l'avis à l'entreprise.
 *
 * Le balisage est volontairement archaïque — tableaux imbriqués, styles en
 * ligne, largeur fixe — parce que les logiciels de messagerie ne partagent ni
 * feuille de style externe, ni mise en page moderne. Tout ce qui ressemble ici
 * à du HTML des années 2000 est une contrainte du média, pas un oubli.
 *
 * Le contenu ne promet rien de plus que le site : réponse sous 48 heures,
 * visite et estimation sans frais. Ces phrases viennent de la page de
 * remerciement et doivent rester alignées avec elle.
 */

/**
 * Coordonnées et repères visuels repris du pied de page du site. S'ils changent
 * là-bas, ils changent ici : les courriels sont la seule partie de la marque
 * qui vit hors du site et personne ne pense à les relire.
 */
const brand = {
  name: "SLC Habitation",
  siteUrl: "https://www.slchabitation.com",
  /* Variante du logo du site dont le mot « HABITATION », noir à l'origine,
     passe au blanc : il disparaîtrait sur le bandeau sombre. Le format PNG est
     imposé par les messageries, qui n'affichent pas le SVG. */
  logoUrl: "https://www.slchabitation.com/images/logo-email.png",
  logoWidth: 128,
  logoHeight: 73,
  phoneDisplay: "(514) 404-8494",
  phoneHref: "tel:+15144048494",
  email: "slchabitation@gmail.com",
  city: "Saint-Eustache, QC",
  licence: "RBQ : 8351-9033-59",
  ink: "#0B0B0B",
  // L'orange du logo, seule couleur de la marque : filet du bandeau et intitulés.
  accent: "#F58027",
  paper: "#FFFFFF",
  page: "#F2F1EF",
  line: "#E2E0DC",
  muted: "#6B6B6B",
  // Les polices de la marque ne se chargent pas dans la plupart des
  // messageries ; elles restent en tête pour celles qui les possèdent déjà.
  headingFont: "Alexandria, 'Helvetica Neue', Helvetica, Arial, sans-serif",
  bodyFont: "Inter, 'Helvetica Neue', Helvetica, Arial, sans-serif",
} as const;

export type EmailContent = { subject: string; html: string; text: string };
export type DetailRow = { label: string; value: string };

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/** Retire les entrées vides pour qu'aucun courriel n'affiche de ligne creuse. */
function presentRows(rows: Array<[string, string | undefined | null]>): DetailRow[] {
  return rows
    .filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()))
    .map(([label, value]) => ({ label, value: value.trim() }));
}

/**
 * Adresse de destination d'un lien courriel. L'adresse vient du formulaire :
 * la validation du champ laisse passer des guillemets, qui refermeraient
 * l'attribut `href` et laisseraient écrire n'importe quel autre attribut dans
 * la messagerie du destinataire. Le pourcentage-encodage neutralise cela ; le
 * `@` est rétabli parce qu'il fait partie de la syntaxe du lien.
 */
function mailtoUrl(address: string) {
  return `mailto:${encodeURIComponent(address).replaceAll("%40", "@")}`;
}

function detailTable(rows: DetailRow[], options: { muted?: boolean } = {}) {
  if (rows.length === 0) return "";
  const labelColor = options.muted ? brand.muted : brand.muted;
  const valueColor = options.muted ? brand.muted : brand.ink;
  const size = options.muted ? "13px" : "15px";
  const cells = rows
    .map(
      ({ label, value }) => `
              <tr>
                <td style="padding:6px 16px 6px 0;font-family:${brand.bodyFont};font-size:${size};line-height:1.5;color:${labelColor};white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
                <td style="padding:6px 0;font-family:${brand.bodyFont};font-size:${size};line-height:1.5;color:${valueColor};vertical-align:top;">${escapeHtml(value)}</td>
              </tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">${cells}
            </table>`;
}

function sectionTitle(text: string) {
  return `<p style="margin:0 0 12px;font-family:${brand.headingFont};font-size:12px;line-height:1.4;letter-spacing:0.12em;text-transform:uppercase;color:${brand.muted};">${escapeHtml(text)}</p>`;
}

function panel(inner: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:separate;background-color:#F7F6F4;border:1px solid ${brand.line};">
            <tr><td style="padding:20px 24px;">${inner}</td></tr>
          </table>`;
}

/** Bouton en tableau : les messageries n'affichent pas un `<button>` stylé. */
function button(href: string, label: string, variant: "solid" | "outline" = "solid") {
  const solid = variant === "solid";
  const safeHref = escapeHtml(href);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
            <tr>
              <td style="background-color:${solid ? brand.ink : brand.paper};border:1px solid ${brand.ink};">
                <a href="${safeHref}" style="display:inline-block;padding:13px 22px;font-family:${brand.bodyFont};font-size:15px;font-weight:600;line-height:1;color:${solid ? "#FFFFFF" : brand.ink};text-decoration:none;">${escapeHtml(label)}</a>
              </td>
            </tr>
          </table>`;
}

function divider() {
  return `<div style="height:1px;line-height:1px;font-size:0;background-color:${brand.line};">&nbsp;</div>`;
}

/**
 * Enveloppe commune : bandeau noir au logo, carte blanche, pied de page.
 * `preheader` est le texte que la boîte de réception montre à côté de l'objet ;
 * sans lui, elle y met le premier fragment de balisage venu.
 */
function shell(options: { title: string; preheader: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="color-scheme" content="light">
    <meta name="supported-color-schemes" content="light">
    <title>${escapeHtml(options.title)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:${brand.page};">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${escapeHtml(options.preheader)}</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background-color:${brand.page};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="border-collapse:collapse;width:600px;max-width:100%;">
            <tr>
              <td style="background-color:${brand.ink};padding:22px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;">
                  <tr>
                    <td style="vertical-align:middle;">
                      <a href="${brand.siteUrl}" style="text-decoration:none;">
                        <img src="${brand.logoUrl}" width="${brand.logoWidth}" height="${brand.logoHeight}" alt="${brand.name}" style="display:block;border:0;width:${brand.logoWidth}px;height:${brand.logoHeight}px;">
                      </a>
                    </td>
                    <td align="right" style="vertical-align:middle;font-family:${brand.bodyFont};font-size:13px;line-height:1.5;color:#FFFFFF;">
                      <a href="${brand.phoneHref}" style="color:#FFFFFF;text-decoration:none;">${brand.phoneDisplay}</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="height:4px;line-height:4px;font-size:0;background-color:${brand.accent};">&nbsp;</td>
            </tr>
            <tr>
              <td style="background-color:${brand.paper};border-left:1px solid ${brand.line};border-right:1px solid ${brand.line};border-bottom:1px solid ${brand.line};padding:36px 32px 32px;">
${options.body}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 0;font-family:${brand.bodyFont};font-size:12px;line-height:1.7;color:${brand.muted};">
${options.footer}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function siteFooter(extra?: string) {
  return `                <p style="margin:0 0 4px;">${brand.name} · ${brand.city} · ${brand.licence}</p>
                <p style="margin:0 0 4px;"><a href="${brand.phoneHref}" style="color:${brand.muted};">${brand.phoneDisplay}</a> · <a href="${mailtoUrl(brand.email)}" style="color:${brand.muted};">${brand.email}</a> · <a href="${brand.siteUrl}" style="color:${brand.muted};">slchabitation.com</a></p>${
                  extra ? `\n                <p style="margin:8px 0 0;">${extra}</p>` : ""
                }`;
}

const steps = [
  {
    title: "Nous lisons votre demande",
    text: "Votre message et vos photos, s’il y en a, sont transmis directement à l’équipe.",
  },
  {
    title: "Nous vous contactons",
    text: "Réponse sous 48 heures, du lundi au vendredi, par téléphone ou par courriel.",
  },
  {
    title: "Nous planifions la visite",
    text: "La visite sert à chiffrer votre projet correctement. Elle est sans frais, l’estimation aussi.",
  },
];

function stepList() {
  return steps
    .map(
      (step, index) => `
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-bottom:${index === steps.length - 1 ? "0" : "16px"};">
              <tr>
                <td width="32" style="vertical-align:top;padding-right:14px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                    <tr>
                      <td width="28" height="28" align="center" style="width:28px;height:28px;background-color:${brand.ink};font-family:${brand.headingFont};font-size:13px;font-weight:700;color:#FFFFFF;text-align:center;">${index + 1}</td>
                    </tr>
                  </table>
                </td>
                <td style="vertical-align:top;">
                  <p style="margin:0 0 2px;font-family:${brand.headingFont};font-size:15px;font-weight:700;line-height:1.4;color:${brand.ink};">${escapeHtml(step.title)}</p>
                  <p style="margin:0;font-family:${brand.bodyFont};font-size:14px;line-height:1.6;color:${brand.muted};">${escapeHtml(step.text)}</p>
                </td>
              </tr>
            </table>`,
    )
    .join("");
}

function photoNote(count: number) {
  if (count <= 0) return "";
  return count === 1 ? "1 photo jointe à votre demande." : `${count} photos jointes à votre demande.`;
}

export type ClientConfirmationInput = {
  firstName: string;
  summaryRows: Array<[string, string | undefined | null]>;
  message: string;
  attachmentCount: number;
};

/** Accusé de réception envoyé à la personne qui a rempli le formulaire. */
export function renderClientConfirmation(input: ClientConfirmationInput): EmailContent {
  const rows = presentRows(input.summaryRows);
  const photos = photoNote(input.attachmentCount);
  const greetingName = input.firstName.trim();
  const intro =
    "Votre projet est entre nos mains. Nous vous répondons sous 48 heures pour convenir d’une visite d’évaluation sans frais.";

  const body = `                <p style="margin:0 0 10px;font-family:${brand.headingFont};font-size:12px;line-height:1.4;letter-spacing:0.14em;text-transform:uppercase;color:${brand.accent};">Demande reçue</p>
                <h1 style="margin:0 0 16px;font-family:${brand.headingFont};font-size:26px;line-height:1.25;font-weight:700;color:${brand.ink};">Merci${greetingName ? `, ${escapeHtml(greetingName)}` : ""}, nous avons bien reçu votre demande</h1>
                <p style="margin:0 0 28px;font-family:${brand.bodyFont};font-size:16px;line-height:1.65;color:#333333;">${escapeHtml(intro)}</p>
                ${divider()}
                <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
                ${sectionTitle("Ce qui se passe maintenant")}
                ${stepList()}
                <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
                ${sectionTitle("Votre demande")}
                ${panel(
                  `${detailTable(rows)}
                    ${
                      input.message.trim()
                        ? `<div style="height:14px;line-height:14px;font-size:0;">&nbsp;</div>
                    <p style="margin:0;font-family:${brand.bodyFont};font-size:14px;line-height:1.65;color:#333333;white-space:pre-wrap;">${escapeHtml(input.message.trim())}</p>`
                        : ""
                    }${
                      photos
                        ? `\n                    <p style="margin:14px 0 0;font-family:${brand.bodyFont};font-size:13px;line-height:1.5;color:${brand.muted};">${escapeHtml(photos)}</p>`
                        : ""
                    }`,
                )}
                <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
                ${sectionTitle("Besoin de nous joindre avant?")}
                ${button(brand.phoneHref, `Appeler ${brand.phoneDisplay}`)}
                <p style="margin:14px 0 0;font-family:${brand.bodyFont};font-size:14px;line-height:1.6;color:${brand.muted};">Ou répondez simplement à ce courriel.</p>`;

  const text = [
    `Merci${greetingName ? `, ${greetingName}` : ""}, nous avons bien reçu votre demande.`,
    "",
    intro,
    "",
    "CE QUI SE PASSE MAINTENANT",
    ...steps.map((step, index) => `${index + 1}. ${step.title} — ${step.text}`),
    "",
    "VOTRE DEMANDE",
    ...rows.map(({ label, value }) => `${label} : ${value}`),
    ...(input.message.trim() ? ["", input.message.trim()] : []),
    ...(photos ? ["", photos] : []),
    "",
    `Besoin de nous joindre avant? ${brand.phoneDisplay} ou répondez à ce courriel.`,
    "",
    `${brand.name} · ${brand.city} · ${brand.licence}`,
    brand.siteUrl,
  ].join("\n");

  return {
    subject: "Nous avons reçu votre demande de soumission",
    html: shell({
      title: "Demande de soumission reçue",
      preheader: intro,
      body,
      footer: siteFooter(
        "Vous recevez ce courriel parce qu’une demande de soumission a été envoyée depuis slchabitation.com.",
      ),
    }),
    text,
  };
}

export type OwnerNotificationInput = {
  fullName: string;
  email: string;
  phone: string;
  projectRows: Array<[string, string | undefined | null]>;
  contextRows: Array<[string, string | undefined | null]>;
  message: string;
  attachmentCount: number;
  submissionId: string;
};

/** Avis envoyé à l'entreprise : conçu pour rappeler le client rapidement. */
export function renderOwnerNotification(input: OwnerNotificationInput): EmailContent {
  const projectRows = presentRows(input.projectRows);
  const contextRows = presentRows(input.contextRows);
  const attachmentLine =
    input.attachmentCount > 0
      ? input.attachmentCount === 1
        ? "1 image jointe à ce courriel."
        : `${input.attachmentCount} images jointes à ce courriel.`
      : "";
  const summaryLine = projectRows
    .filter(({ label }) => label === "Service" || label === "Ville du projet")
    .map(({ value }) => value)
    .join(" · ");

  const body = `                <p style="margin:0 0 10px;font-family:${brand.headingFont};font-size:12px;line-height:1.4;letter-spacing:0.14em;text-transform:uppercase;color:${brand.accent};">Nouvelle demande de soumission</p>
                <h1 style="margin:0 0 20px;font-family:${brand.headingFont};font-size:26px;line-height:1.25;font-weight:700;color:${brand.ink};">${escapeHtml(input.fullName)}</h1>
                ${panel(
                  `${detailTable([
                    { label: "Téléphone", value: input.phone },
                    { label: "Courriel", value: input.email },
                  ])}
                    <div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                      <tr>
                        <td style="padding-right:10px;">${button(`tel:${input.phone.replace(/[^0-9+]/g, "")}`, "Appeler")}</td>
                        <td>${button(mailtoUrl(input.email), "Répondre", "outline")}</td>
                      </tr>
                    </table>`,
                )}
                <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
                ${sectionTitle("Le projet")}
                ${detailTable(projectRows)}
                <div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
                ${sectionTitle("Message")}
                <p style="margin:0;font-family:${brand.bodyFont};font-size:15px;line-height:1.7;color:#333333;white-space:pre-wrap;">${escapeHtml(input.message.trim())}</p>${
                  attachmentLine
                    ? `\n                <p style="margin:16px 0 0;font-family:${brand.bodyFont};font-size:13px;line-height:1.5;color:${brand.muted};">${escapeHtml(attachmentLine)}</p>`
                    : ""
                }
                <div style="height:28px;line-height:28px;font-size:0;">&nbsp;</div>
                ${divider()}
                <div style="height:24px;line-height:24px;font-size:0;">&nbsp;</div>
                ${sectionTitle("Provenance et consentement")}
                ${detailTable(contextRows, { muted: true })}`;

  const text = [
    `Nouvelle demande de soumission — ${input.fullName}`,
    "",
    `Téléphone : ${input.phone}`,
    `Courriel : ${input.email}`,
    "",
    "LE PROJET",
    ...projectRows.map(({ label, value }) => `${label} : ${value}`),
    "",
    "MESSAGE",
    input.message.trim(),
    ...(attachmentLine ? ["", attachmentLine] : []),
    "",
    "PROVENANCE ET CONSENTEMENT",
    ...contextRows.map(({ label, value }) => `${label} : ${value}`),
    "",
    `Référence : ${input.submissionId}`,
  ].join("\n");

  return {
    subject: `Nouvelle soumission — ${input.fullName}`,
    html: shell({
      title: `Nouvelle demande de soumission — ${input.fullName}`,
      preheader: [input.fullName, summaryLine, input.phone].filter(Boolean).join(" · "),
      body,
      footer: `                <p style="margin:0 0 4px;">Répondre à ce courriel écrit directement à ${escapeHtml(input.email)}.</p>
                <p style="margin:0;">Référence de la demande : ${escapeHtml(input.submissionId)}</p>`,
    }),
    text,
  };
}
