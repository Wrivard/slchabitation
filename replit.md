# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

### Site public (`artifacts/slc-habitation`)

#### Comment le site est fabriqué

- Une page = un composant React dans `src/pages/`. Il n'y a plus aucun fichier
  HTML de page : le dossier `site/`, l'ancien moteur Webflow (`webflow.js`,
  jQuery, GSAP) et les scripts de conversion ont été retirés.
- Un seul document sert de gabarit : `index.html`. Il contient tout ce qui est
  commun à toutes les pages (bandeau de consentement, mesure d'audience,
  feuilles de style héritées de Webflow, icônes, fiche de l'entreprise).
- `pnpm run build` construit l'application pour le navigateur, puis pour le
  serveur (`vite.config.ssr.ts`), puis `scripts/prerender.mjs` écrit une page
  statique par adresse : il part du gabarit construit et y insère le contenu
  rendu par React. Toute modification d'une page se répercute donc
  automatiquement sur sa version statique.
- L'entête, le pied de page et le menu viennent de
  `src/components/site/site-chrome-markup.ts`, un fichier tenu à la main (plus
  aucune génération automatique).
- Les animations reprises du site Webflow (menu, apparition au défilement,
  compteurs, retour en haut) sont des comportements React réunis dans
  `src/lib/behaviors/` ; chaque page les active avec `useSitePageBehaviors`.

#### Modifier une page

1. Modifier le composant correspondant dans `src/pages/`.
2. Pour le titre, la description, l'adresse canonique ou la fiche structurée de
   la page : `src/lib/seo-route-metadata.json`. Pour quelque chose de commun à
   toutes les pages : `index.html`.
3. `pnpm run build`, puis `pnpm run structure:check` et `pnpm run visual:check`
   pour vérifier que rien d'autre n'a bougé.

#### Points de vigilance

- Toutes les pages chargent désormais la feuille de style de l'application
  (Tailwind, avec sa remise à zéro) en plus des feuilles héritées de Webflow,
  comme c'était déjà le cas dans l'aperçu de développement. Une règle Tailwind
  ajoutée sans précaution peut donc toucher une page héritée.
- Filet de sécurité avant/après une modification du site :
  `pnpm run parity:baseline` reconstruit le site tel qu'il était au commit
  déclaré dans `parity-reference.json` et en garde des captures ;
  `pnpm run parity:check` compare la construction actuelle (structure du HTML
  puis captures d'écran, 3 largeurs, avec et sans JavaScript). Les captures de
  référence ne sont pas versionnées : elles se régénèrent à la demande.
- Les captures de référence pèsent plus de 100 Mo : elles ne sont pas
  versionnées, mais reconstruites depuis le commit inscrit dans
  `parity-reference.json` (`pnpm run parity:baseline`). Ce qui est versionné :
  les empreintes de structure (`structure-baseline/`, enregistrées sur l'état
  accepté) et la liste des écarts visuels acceptés
  (`visual-accepted-deltas.json`, nommés un par un et rattachés au commit de
  référence).
- Après une modification du site acceptée par le propriétaire : relancer
  `pnpm run structure:baseline`, inscrire le commit validé dans
  `parity-reference.json` et vider `visual-accepted-deltas.json`. Sans cela, la
  comparaison signale indéfiniment des écarts déjà approuvés.
- `pnpm run behaviors:check` vérifie les animations reprises du site Webflow sur
  la page technique `/verification-interactions`.
- Le navigateur remonte l'application par-dessus le HTML prérendu
  (`createRoot`), il ne l'hydrate pas. C'est le comportement d'origine, et le
  contrôle visuel le vérifie page par page ; passer à `hydrateRoot` demanderait
  que le rendu serveur et le rendu client soient identiques au caractère près,
  ce qui n'est pas encore le cas (aperçu statique du formulaire de soumission).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
