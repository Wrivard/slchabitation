---
name: Static public pages
description: Rules for keeping SLC Habitation's public marketing pages crawlable without JavaScript.
---

Public marketing routes must be emitted as static HTML documents during the production build, with a clean canonical URL, route-specific metadata, primary content, and structured data available before JavaScript executes.

**Why:** The visual application is client-rendered, while search, social, and AI crawlers may not execute JavaScript. The retained source documents provide the complete accessible content and metadata needed by those clients.

**How to apply:** When adding or changing an indexable page, update the prerender route inventory, sitemap, internal links, and production route mapping together. Keep the clean URL as the canonical public form; legacy `.html` paths must not become a second indexable page.

Static fallbacks must not expose a submit-capable form unless they can satisfy the same consent, anti-abuse, validation, attribution, and idempotency contract as the interactive application.

**Why:** A simplified HTML form can look functional while bypassing required protections or posting a payload the server must reject.

**How to apply:** Prefer an informational fallback with explicit no-JavaScript guidance when secure submission depends on client-side protection. Keep the interactive form as the only submission path unless full parity is deliberately implemented.