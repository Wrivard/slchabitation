---
name: Static public pages
description: Rules for keeping SLC Habitation's public marketing pages crawlable without JavaScript.
---

Public marketing routes must be emitted as static HTML documents during the production build, with a clean canonical URL, route-specific metadata, primary content, and structured data available before JavaScript executes.

**Why:** The visual application is client-rendered, while search, social, and AI crawlers may not execute JavaScript. The retained source documents provide the complete accessible content and metadata needed by those clients.

**How to apply:** When adding or changing an indexable page, update the prerender route inventory, sitemap, internal links, and production route mapping together. Keep the clean URL as the canonical public form; legacy `.html` paths must not become a second indexable page.