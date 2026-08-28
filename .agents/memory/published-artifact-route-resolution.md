---
name: Published artifact route resolution
description: Production routing behavior for nested prerendered pages in the SLC Habitation artifact.
---

Nested public pages can be served as the workspace's prerendered `index.html` locally while a published artifact falls back to the root HTML for clean paths. Exact rewrite entries are not sufficient when the platform normalizes a route to a trailing slash; keep wildcard rewrites ending in `/*` in the deployment configuration and register the same paths in the Vite preview resolver.

**Why:** The static artifact handler can bypass Vite middleware and ignore an exact nested route, returning the root Webflow document. That makes the page appear unstyled or unrelated even though the generated nested HTML and CSS are valid.

**How to apply:** When adding nested public routes, validate both the clean path and the direct `/index.html` path after publishing. Also confirm the custom domain is attached to the Replit deployment; a domain still served by another host cannot receive these route fixes.

Static deployment rewrites are internal file mappings, not HTTP redirects. When a legacy public URL must be consolidated and the static service cannot emit a permanent redirect, map it to the canonical route's prerendered document so its canonical metadata is correct, remove all internal discovery, and keep an application/preview redirect for interactive visits.

**Why:** Rewriting a legacy path to its own duplicate document preserves two crawlable responses; mapping it to the canonical document consolidates the static representation even though the platform returns the file without changing the browser URL.

**How to apply:** Prefer a true permanent redirect where the serving layer supports one. For Replit static artifact rewrites, point the legacy route and wildcard directly at the canonical route's `index.html`, and verify the canonical tag in the returned source.