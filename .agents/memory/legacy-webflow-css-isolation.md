---
name: Legacy Webflow CSS isolation
description: How to prevent preserved Webflow styles and React funnel styles from breaking each other.
---

Keep the React paid-funnel theme scoped to its root shell, and use dedicated semantic classes for layout-critical chrome rather than relying only on generic utility classes.

**Why:** Preserved Webflow rules can override generic display and typography utilities at some breakpoints. Conversely, global funnel tokens or heading rules can silently restyle the original site.

**How to apply:** Put funnel tokens and heading overrides under the funnel root. Preserve the original global theme. For headers and other non-wrapping structures, use uniquely named classes with explicit layout rules and verify computed positions at mobile, tablet, and desktop widths.

## The cascade-layer trap

The preserved Webflow stylesheets are linked from the HTML shell *unlayered*, while Tailwind v4 puts every utility inside a cascade layer. Unlayered author styles beat layered ones regardless of specificity, so a bare element selector such as `a`, `p`, `ul`, `li`, `h3`, `h4`, `summary`, or `img` silently wins over the utility class on the element. Symptoms look unrelated to CSS at first: invisible dark-on-dark footer links, an accordion marker dropping below its label because `display: flex` never applied, list rows with phantom indentation, and card titles rendering far larger than their `text-xl` class suggests.

**Fix:** add scoped `.<funnel-root> <element>` rules (specificity beats the bare selector, and both are unlayered) that set the affected properties to `revert-layer`. That hands control back to the Tailwind utility on the element instead of hard-coding a value.

**Caveat:** `revert-layer` falls through to the framework reset when the element carries no matching utility, so an unsized heading collapses to body size. Audit every element covered by such a rule and give it an explicit utility.

**Also:** any statically prerendered fallback markup for these routes must be wrapped in the same funnel-root class, or it renders with the legacy styles the scoped rules were meant to neutralize.