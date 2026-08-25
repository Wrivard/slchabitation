---
name: Lazy image validation
description: How to distinguish deferred native lazy loading from genuinely broken renovation-page images.
---

When validating long photographic pages, scroll each `loading="lazy"` image into the viewport and wait for its `complete` state before using `naturalWidth` to judge whether it loaded.

**Why:** A full-page scan can report `naturalWidth === 0` for images whose native lazy load was never triggered, even when every eventual image request returns successfully.

**How to apply:** For image-health browser checks, evaluate each image only after targeted viewport exposure and a short completion wait; report HTTP failures separately from images that remain pending.