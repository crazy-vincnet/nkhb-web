## 2024-09-27 - [Optimize i18n lookup]
**Learning:** Found an O(n) array search inside a high-frequency render loop hook (`getContent` calling `dbContent.find`). In highly localized React apps, this O(n) lookup occurs for every translated string on the page during render, becoming a performance bottleneck.
**Action:** Always memoize dictionary-like arrays into a `Map` structure for O(1) lookups when they are frequently accessed during render cycles.
## 2024-11-20 - [Optimize Home Component Rendering]
**Learning:** In React Router setups, components relying on `useLocation` will re-render whenever the URL changes, including hash navigation (e.g., clicking anchor links). If these components pass inline functions down to large child sections, those sections will unnecessarily re-render as well.
**Action:** When top-level components depend on `useLocation` for scroll behaviors or routing but also render static structural sections, always extract event handlers using `useCallback` and wrap the child sections in `React.memo` to break the rendering chain.
## 2024-11-20 - [Memoize expensive array operations in render]
**Learning:** In React components that render large lists and have interactive local state (like modal toggles or selected items), raw array operations like `.filter()` or `.map()` in the render body will recalculate on *every* state update, creating O(N) performance bottlenecks.
**Action:** Always wrap computationally expensive array operations (like filtering lists) in `useMemo` with explicit dependency arrays to prevent O(N) recalculations on every unrelated render cycle.
