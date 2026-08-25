---
name: Legacy Webflow CSS isolation
description: How to prevent preserved Webflow styles and React funnel styles from breaking each other.
---

Keep the React paid-funnel theme scoped to its root shell, and use dedicated semantic classes for layout-critical chrome rather than relying only on generic utility classes.

**Why:** Preserved Webflow rules can override generic display and typography utilities at some breakpoints. Conversely, global funnel tokens or heading rules can silently restyle the original site.

**How to apply:** Put funnel tokens and heading overrides under the funnel root. Preserve the original global theme. For headers and other non-wrapping structures, use uniquely named classes with explicit layout rules and verify computed positions at mobile, tablet, and desktop widths.