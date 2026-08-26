---
name: Published artifact route resolution
description: Production routing behavior for nested prerendered pages in the SLC Habitation artifact.
---

Nested public pages can be served as the workspace's prerendered `index.html` locally while a published artifact falls back to the root HTML for clean paths. Exact rewrite entries are not sufficient when the platform normalizes a route to a trailing slash; keep wildcard rewrites ending in `/*` in the deployment configuration and register the same paths in the Vite preview resolver.

**Why:** The static artifact handler can bypass Vite middleware and ignore an exact nested route, returning the root Webflow document. That makes the page appear unstyled or unrelated even though the generated nested HTML and CSS are valid.

**How to apply:** When adding nested public routes, validate both the clean path and the direct `/index.html` path after publishing. Also confirm the custom domain is attached to the Replit deployment; a domain still served by another host cannot receive these route fixes.