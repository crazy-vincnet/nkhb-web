## 2024-09-27 - [Optimize i18n lookup]
**Learning:** Found an O(n) array search inside a high-frequency render loop hook (`getContent` calling `dbContent.find`). In highly localized React apps, this O(n) lookup occurs for every translated string on the page during render, becoming a performance bottleneck.
**Action:** Always memoize dictionary-like arrays into a `Map` structure for O(1) lookups when they are frequently accessed during render cycles.
## 2024-11-20 - [Optimize Home Component Rendering]
**Learning:** In React Router setups, components relying on `useLocation` will re-render whenever the URL changes, including hash navigation (e.g., clicking anchor links). If these components pass inline functions down to large child sections, those sections will unnecessarily re-render as well.
**Action:** When top-level components depend on `useLocation` for scroll behaviors or routing but also render static structural sections, always extract event handlers using `useCallback` and wrap the child sections in `React.memo` to break the rendering chain.
## 2024-12-05 - [Optimize Array Filtering in Interactive Components]
**Learning:** Found an $O(N)$ array filtering operation (`posts.filter(...)`) running on every render in a component with interactive local state (opening modals). In React, any local state change triggers a re-render. If computationally expensive derived state calculations aren't memoized, it leads to performance degradation whenever the user interacts with the UI.
**Action:** Always wrap expensive array operations like `.filter()` or `.map()` with `useMemo` when working in components that handle frequent or interactive local state updates (like modals, tabs, or expanded views), ensuring you pass the correct dependency array to prevent stale closures.
