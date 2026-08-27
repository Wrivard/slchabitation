/**
 * Pages du tunnel publicitaire.
 *
 * Sert à valider le paramètre `?pub=` ajouté par les boutons de ces pages :
 * seule une provenance connue est mémorisée puis transmise avec la demande de
 * soumission, sinon n'importe quelle adresse pourrait polluer la traçabilité.
 *
 * La même liste existe côté serveur (`ALLOWED_PAID_PAGES` dans
 * artifacts/api-server/src/routes/submit-form.ts) : toute page ajoutée ici doit
 * y être reportée.
 */
export const paidPageSlugs = [
  'renovation-sous-sol',
  'renovation-salle-de-bain',
  'renovation-cuisine',
  'agrandissement-maison',
] as const;

export type PaidPageSlug = (typeof paidPageSlugs)[number];

export function isPaidPageSlug(value: string): value is PaidPageSlug {
  return (paidPageSlugs as readonly string[]).includes(value);
}
