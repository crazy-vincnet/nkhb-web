## 2024-09-27 - [Optimize i18n lookup]
**Learning:** Found an O(n) array search inside a high-frequency render loop hook (`getContent` calling `dbContent.find`). In highly localized React apps, this O(n) lookup occurs for every translated string on the page during render, becoming a performance bottleneck.
**Action:** Always memoize dictionary-like arrays into a `Map` structure for O(1) lookups when they are frequently accessed during render cycles.

## 2024-10-24 - [Memoizing Handlers and Sections for Hash Navigation]
**Learning:** In Vite/React apps using `react-router-dom`, location hash changes (e.g., clicking anchor links) cause the route component to re-render. If top-level components pass inline functions as props to deeply nested section components, this hash change triggers an expensive full-page re-render.
**Action:** Always extract and memoize event handler props using `useCallback`, and wrap large layout section components in `React.memo` to ensure they bail out of rendering when irrelevant parent state changes. When doing so in TypeScript, avoid `React.FC` on the variable assignment to satisfy `React.memo`'s type constraints.
