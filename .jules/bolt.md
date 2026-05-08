## 2024-05-08 - LCP Preloading
**Learning:** Background images assigned in CSS are not discovered by the browser's preload scanner, causing a delay in LCP.
**Action:** Preload the hero image using `<link rel="preload" as="image">` in the HTML head to improve LCP.
