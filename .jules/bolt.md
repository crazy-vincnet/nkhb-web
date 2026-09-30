## 2024-09-27 - [Optimize i18n lookup]
**Learning:** Found an O(n) array search inside a high-frequency render loop hook (`getContent` calling `dbContent.find`). In highly localized React apps, this O(n) lookup occurs for every translated string on the page during render, becoming a performance bottleneck.
**Action:** Always memoize dictionary-like arrays into a `Map` structure for O(1) lookups when they are frequently accessed during render cycles.

## 2024-10-24 - [Memoize mapped section components]
**Learning:** In highly componentized multi-section pages (like `Home.tsx`), sections mapped from a registry array often re-render when the parent's state updates (like location changes), even if their own props remain stable. `React.FC` type signatures directly on the const assignment clash with `React.memo` wrapping, requiring an inline prop typing approach.
**Action:** Always wrap large static section components with `React.memo()` by removing `React.FC` and typing props inline within the `memo` arguments. Combine this with `useCallback` for event handlers passed from the parent to avoid unnecessary deep tree re-renders.
