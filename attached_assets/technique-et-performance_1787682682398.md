# Technique et performance

Table des matières :
1. Arborescence et routing
2. Indexation : noindex, canonical, robots.txt, AdsBot
3. Budget de performance et Core Web Vitals
4. Personnalisation dynamique sans casser la perf ni la sécurité
5. Images, polices, JavaScript
6. Données structurées
7. Hébergement et conformité

---

## 1. Arborescence et routing

Stack par défaut : Next.js 15 App Router, TypeScript, Tailwind, shadcn/ui, Supabase (`ca-central-1`), Vercel.

```
app/
├── (site)/                       # site principal, navigation complète
│   └── ...
└── (funnel)/                     # route group publicitaire
    ├── layout.tsx                # layout SANS navigation du site
    └── pub/
        ├── renovation-cuisine/
        │   ├── page.tsx
        │   └── content.ts        # contenu spécifique, typé
        ├── renovation-salle-de-bain/
        ├── renovation-sous-sol/
        └── merci/
            └── page.tsx
components/funnel/
├── FunnelForm.tsx                # client component — le seul de la page
├── TrustBar.tsx
├── ProcessSteps.tsx
└── ...
lib/funnel/
├── attribution.ts
├── validation.ts
└── conversions.ts
app/api/funnel/lead/route.ts
```

**Pourquoi un route group séparé :** le layout du funnel n'hérite ni de la navigation du site, ni des scripts tiers du site principal (chat, pixels sociaux, bannières promo). Chaque script tiers hérité coûte du INP et ajoute une sortie possible.

**URL :** garder les pages sur le domaine principal. La politique *Destination mismatch* de Google refuse les annonces dont le domaine de l'URL d'affichage ne correspond pas à l'URL finale, ou qui redirigent vers un autre domaine. Un sous-répertoire `/pub/` ou `/lp/` est le bon compromis : facile à exclure de l'index et du sitemap, tout en gardant le domaine.

**Une page de merci réelle** (`/pub/merci`), pas seulement un état de succès en JavaScript. Ça donne un événement de page vue fiable, une URL partageable pour le QA, et un point de mesure stable.

## 2. Indexation : noindex, canonical, robots.txt, AdsBot

Les pages funnel ne doivent pas être indexées : elles cannibalisent les pages SEO, elles diluent la qualité moyenne du domaine, elles brouillent l'attribution entre payant et organique, et elles consomment du budget de crawl.

**La bonne méthode :**

```tsx
// app/(funnel)/pub/renovation-cuisine/page.tsx
export const metadata: Metadata = {
  title: 'Rénovation de cuisine à Laval | Estimation en 24 h',
  description: '...',
  robots: { index: false, follow: false },
}
```

**Les pièges à éviter :**

| Piège | Pourquoi c'est un problème |
|---|---|
| `Disallow: /pub/` dans robots.txt | Googlebot ne peut plus crawler, donc ne peut plus **lire** le `noindex`. La page peut rester indexée. |
| `noindex` **et** `canonical` vers une autre page | Deux signaux contradictoires. Choisir l'un ou l'autre. |
| Compter sur robots.txt pour bloquer les pubs | AdsBot-Google et AdsBot-Google-Mobile **ignorent le groupe `*`** dans robots.txt. Seule une règle nommant explicitement AdsBot les affecte — et une telle règle ferait refuser les annonces pour « Destination not accessible ». |
| Exclure la page du sitemap seulement | Insuffisant, Google peut la découvrir autrement. |

**Résumé :** `noindex, follow` par balise meta (ou en-tête `X-Robots-Tag`), pas de `Disallow`, jamais de règle robots.txt ciblant AdsBot, exclusion du sitemap.

**Vérifier que la page est accessible à AdsBot :** HTTP 200 partout dans les régions ciblées, pas de géo-blocage, pas de mur de consentement bloquant, pas d'authentification, contenu principal présent dans le HTML servi (le SSR de Next.js règle ça par défaut — attention aux blocs rendus uniquement côté client).

## 3. Budget de performance et Core Web Vitals

Seuils au 75e centile des sessions réelles (données CrUX, fenêtre glissante de 28 jours). Les trois doivent passer en même temps.

| Métrique | Bon | À améliorer | Cible funnel |
|---|---|---|---|
| LCP | ≤ 2,5 s | ≤ 4 s | **< 1,5 s** |
| INP | ≤ 200 ms | ≤ 500 ms | **< 150 ms** |
| CLS | ≤ 0,1 | ≤ 0,25 | **< 0,05** |

Pourquoi viser plus serré que le seuil : une page qui charge en 1 seconde convertit environ 3× mieux qu'une page à 5 secondes, et chaque seconde supplémentaire coûte grosso modo 7 % des conversions. Sur du trafic acheté, c'est du budget brûlé directement.

**Budget concret à respecter :**

- JS initial : **< 100 kB gzip**. Le formulaire est le seul composant client de la page.
- Image hero : < 150 kB en AVIF/WebP, dimensions explicites, `priority`
- Polices : `next/font` en local, sous-ensemble latin, `display: swap`, 2 graisses maximum
- Zéro script tiers avant le consentement (voir `tracking-et-mesure.md`)
- Aucun carrousel automatique, aucune animation d'entrée sur le hero

**Vérifier avant le lancement :** Lighthouse mobile en throttling, puis PageSpeed Insights sur l'URL réelle. Rappel : le champ CrUX se met à jour sur 28 jours glissants — après un correctif, il faut plusieurs semaines pour juger sur données réelles. Le laboratoire sert au QA, le champ sert au verdict.

**INP :** c'est la métrique la plus difficile à passer et un formulaire multi-étapes est précisément un générateur d'interactions. Garder les handlers légers, éviter la validation lourde à chaque frappe (débouncer), éviter les re-rendus de la page entière à chaque changement d'étape.

**CLS :** réserver la hauteur du formulaire entre les étapes, sinon chaque transition d'étape produit un décalage. Réserver aussi la place des messages d'erreur.

## 4. Personnalisation dynamique sans casser la perf ni la sécurité

L'objectif est le message match par groupe d'annonces sans multiplier les pages. Deux approches :

**A. Pages distinctes (défaut).** Une page par intention. Plus simple, meilleur contrôle du contenu original, aucun risque. À privilégier tant qu'on est sous ~8 pages.

**B. Jeton de variante en liste blanche.** Utile quand plusieurs groupes d'annonces partagent la même page mais devraient afficher un titre différent.

```ts
// lib/funnel/variants.ts
const VARIANTS = {
  'cuisine-mtl':  { h1: 'Rénovation de cuisine à Montréal', ... },
  'cuisine-laval':{ h1: 'Rénovation de cuisine à Laval', ... },
} as const

export function getVariant(v?: string) {
  return (v && v in VARIANTS) ? VARIANTS[v as keyof typeof VARIANTS] : VARIANTS['cuisine-mtl']
}
```

Le suffixe d'URL final de Google Ads porte `?v=cuisine-laval`.

**Ne jamais injecter un paramètre brut dans le DOM.** Le pattern « keyword insertion » naïf (`?kw=` rendu tel quel dans le H1) est une faille XSS et produit des titres incohérents quand le paramètre est manipulé. Liste blanche uniquement, avec repli explicite.

**Attention au rendu dynamique :** lire `searchParams` dans un composant serveur bascule la page en rendu dynamique et dégrade le TTFB. Préférer la page statique et hydrater la variante côté client après le premier rendu, **ou** garder des pages séparées. Si la variante affecte le H1 (donc le LCP), privilégier des pages séparées.

## 5. Images, polices, JavaScript

- `next/image` partout, avec `width`/`height` explicites. Le hero en `priority`, le reste en `loading="lazy"`.
- Photos de chantier réelles, recadrées et compressées. Pas de banque d'images : la clientèle en rénovation reconnaît une fausse cuisine de stock et c'est un signal de méfiance.
- Galerie avant/après : deux images statiques côte à côte plutôt qu'un slider JavaScript. Moins de JS, pas de CLS, aussi convaincant.
- `next/font` local, jamais de `<link>` vers Google Fonts (requête tierce bloquante).
- Icônes : SVG inline ou `lucide-react` en imports nommés, jamais une police d'icônes.

## 6. Données structurées

Sur une page en `noindex`, le balisage ne produira pas de résultat enrichi. Il reste utile pour la compréhension de l'entité par les systèmes de Google. Garder ça léger :

- `LocalBusiness` (ou `HomeAndConstructionBusiness`) avec nom, téléphone, adresse ou `areaServed`, URL — sur le site principal en priorité
- `Service` sur la page funnel si on veut décrire l'offre
- **Ne pas ajouter `FAQPage` pour un résultat enrichi** : les résultats enrichis FAQ ont été retirés de Google Search le 7 mai 2026 (le type Schema.org reste valide, mais l'affichage n'existe plus)
- **Ne jamais baliser un `AggregateRating` auto-déclaré** ou des avis non vérifiables

Règle générale : baliser seulement ce qui est visible sur la page et vrai.

## 7. Hébergement et conformité

- **Supabase en `ca-central-1`** pour que les renseignements personnels des leads restent au Canada. La Loi 25 impose une évaluation avant toute communication de renseignements hors Québec ; garder les données au pays évite le débat.
- **HTTPS obligatoire**, sans exception — une page de collecte en HTTP est refusée et indéfendable.
- **Clés d'API côté serveur uniquement.** La clé `service_role` de Supabase ne sort jamais du serveur ; la route handler l'utilise, le client jamais.
- **Row Level Security activée** sur la table des leads, insertion uniquement via la route serveur.
- **Rétention** : définir une durée de conservation des leads et l'écrire dans la politique de confidentialité (la Loi 25 exige de préciser la durée de conservation).
