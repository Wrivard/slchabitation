---
name: Legacy HTML in React
description: Lifecycle constraints when migrating Webflow or other static HTML pages into React components
---

When static HTML is rendered through React and its original scripts are re-injected after mount, page code that waits for `DOMContentLoaded` or `window.load` will otherwise never initialize because those browser events have already fired.

**Why:** React components can mount after browser lifecycle events complete.

**How to apply:** Account for already-complete document lifecycle events when preserving legacy script behavior.

Webflow's interaction engine (ix2) is a second, sharper case: its bundle loads and its event data is populated, yet its handlers are bound to the DOM it saw at init, so nothing replays for React-mounted markup. Collapsible panels keep the inline `height: 0px` Webflow left on them and never open.

**Why:** A presence check for a live interaction engine looks like the safe way to avoid double-animating, but it always reports "active" here and silently disables the React-side fallback — the panels stay closed with no error.

**How to apply:** For imported Webflow accordions/disclosures, drive the open/close animation from React (measure `scrollHeight`, then settle to `auto` on `transitionend`) unconditionally. Do not gate that behind detecting `Webflow.require('ix2')`.