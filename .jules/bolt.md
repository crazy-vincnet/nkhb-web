
## 2024-06-29 - Modal State Management Causing Full-Page Re-renders
**Learning:** In this specific architecture, handling deeply nested child component events via `window.postMessage` at the root `App.tsx` component is a performance anti-pattern. Because the modal state (`isArticleModalOpen`, etc.) was kept in `App.tsx`, toggling any modal caused a full re-render of all nested components (including Header, Footer, and the active Route), significantly degrading responsiveness when opening/closing modals.
**Action:** Isolate global overlay states (like modals triggered by `postMessage`) into their own dedicated container components (e.g., `<Modals />`), wrapped in `React.memo`. This ensures state updates only re-render the modals themselves, not the entire application tree.
