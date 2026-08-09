## 2023-10-27 - [Preload Critical Background Images]
**Learning:** Background images loaded via CSS (`url('images/main-hero.png')`) are discovered very late in the rendering pipeline, causing delayed Largest Contentful Paint (LCP) times. The browser has to parse HTML, fetch CSS, parse CSS, and compute styles before it even knows it needs the image.
**Action:** Use `<link rel="preload" as="image" href="...">` in the `<head>` for critical LCP hero images defined in CSS to ensure the browser fetches them immediately.
