## 2026-05-10 - [LCP Image Preload Optimization]
**Learning:** The largest contentful paint (LCP) in this application is the hero image `images/main-hero.png`. Preloading the image provides a substantial improvement in the initial rendering speed, dropping the LCP from ~612 ms to ~508 ms.
**Action:** Always identify the hero image and utilize `<link rel="preload" as="image" href="...">` for critical rendering path optimization, especially when the image is large and immediately visible.
