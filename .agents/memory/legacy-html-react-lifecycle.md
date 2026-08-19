---
name: Legacy HTML in React
description: Lifecycle constraints when migrating Webflow or other static HTML pages into React components
---

When static HTML is rendered through React and its original scripts are re-injected after mount, page code that waits for `DOMContentLoaded` or `window.load` will otherwise never initialize because those browser events have already fired.

**Why:** React components can mount after browser lifecycle events complete.

**How to apply:** Account for already-complete document lifecycle events when preserving legacy script behavior.