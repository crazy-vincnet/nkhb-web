## 2024-09-27 - [Optimize i18n lookup]
**Learning:** Found an O(n) array search inside a high-frequency render loop hook (`getContent` calling `dbContent.find`). In highly localized React apps, this O(n) lookup occurs for every translated string on the page during render, becoming a performance bottleneck.
**Action:** Always memoize dictionary-like arrays into a `Map` structure for O(1) lookups when they are frequently accessed during render cycles.

## 2024-10-27 - [Optimize array filtering in Board component]
**Learning:** Found an O(n) array filter inside the render loop of the `Board` component. While not currently the biggest bottleneck, recomputing it on every render, especially with modal state changes potentially triggering parent re-renders, is inefficient.
**Action:** Always wrap derived data calculations that involve iterating over lists (like `.filter()`, `.map()`, or sorting) in `useMemo` if they are not explicitly tied to the current render cycle's changing state, to prevent unnecessary work.
