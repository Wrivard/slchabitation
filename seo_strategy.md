# SEO Strategy

## In scope
- Public-facing SLC Habitation marketing and service pages in `artifacts/slc-habitation`.
- Public home, about, renovation, extension/new construction, custom work, realizations/gallery, quote/contact, cookie-policy, and privacy-policy pages.

## Out of scope
- Authenticated or internal application surfaces.
- `/pub/**` paid-funnel pages, per the task scope.
- API server, mockup sandbox, generated build output, and migration backup as deployable SEO surfaces unless they directly determine the public web artifact.

## Target audience
- French-speaking homeowners and commercial property owners in Québec seeking renovation, extension, new construction, and custom construction services from SLC Habitation.

## Primary keywords
- Unknown at query level; source content indicates renovation, agrandissement, construction neuve, travaux sur mesure, rénovation de cuisine, rénovation de salle de bain, rénovation de sous-sol, Laval, Laurentides, and SLC Habitation.

## Crawler assumptions
- Public routes should be indexable, shareable, and visible in initial HTML to Googlebot, social preview bots, and AI crawlers.
- Public pages are statically prerendered from `src/entry-server.tsx` and `scripts/prerender.mjs`; the preview/static delivery configuration is part of the SEO surface.

## Dismissed categories
- None yet.
