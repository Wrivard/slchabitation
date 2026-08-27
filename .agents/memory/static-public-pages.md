---
name: Static public pages
description: Rules for keeping SLC Habitation's public marketing pages crawlable without JavaScript.
---

Public marketing routes must be emitted as static HTML documents during the production build, with a clean canonical URL, route-specific metadata, primary content, and structured data available before JavaScript executes.

**Why:** The visual application is client-rendered, while search, social, and AI crawlers may not execute JavaScript. The retained source documents provide the complete accessible content and metadata needed by those clients.

**How to apply:** When adding or changing an indexable page, update the prerender route inventory, sitemap, internal links, and production route mapping together. Keep the clean URL as the canonical public form; legacy `.html` paths must not become a second indexable page.

Static documents must be produced by rendering the application itself, never by re-writing the same content as strings in the build script.

**Why:** Hand-written static bodies drift silently — wording, missing contact details and missing elements accumulate until the crawler and the no-JavaScript visitor read a different page from everyone else.

**How to apply:** Keep the legacy document (head, legacy stylesheets, tag manager) for pages that still come from the old template and replace only the application container's content with the server-rendered output. Any page whose component redirects instead of rendering content is the one exception worth keeping on the legacy body, so an indexed URL does not turn into a bare "redirecting…" stub.

A server-rendered page must be checked with JavaScript disabled, not only in the browser.

**Why:** Entrance animations render their hidden starting state into the static HTML (`opacity:0`), so a whole section can be present in the markup yet invisible — and the page still measures the same height, which hides the problem from crude checks.

**How to apply:** Ship a `<noscript>` rule in the prerendered head that neutralises the exact inline hidden state, and match it precisely (`opacity:0;`) so partial opacities in the legacy markup are untouched.

Static fallbacks must not expose a submit-capable form unless they can satisfy the same consent, anti-abuse, validation, attribution, and idempotency contract as the interactive application.

**Why:** A simplified HTML form can look functional while bypassing required protections or posting a payload the server must reject.

**How to apply:** Prefer an informational fallback with explicit no-JavaScript guidance when secure submission depends on client-side protection. Keep the interactive form as the only submission path unless full parity is deliberately implemented.