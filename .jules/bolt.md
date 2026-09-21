
## 2024-05-18 - Isolate top-level modal state to prevent React tree re-renders
**Learning:** Having un-memoized UI state (like `isArticleModalOpen`) at the root `App.tsx` level triggers a full re-render of the entire `Router` and all its child components (like `Home`, `About`, headers, etc.) every time a modal is opened or closed. This is a severe performance anti-pattern.
**Action:** Extract application-wide UI overlay states (like modals, toasts, drawers) into their own distinct component (e.g., `<Modals />`). Wrap that component in `React.memo` and place it at the root level, but *isolated* from the main page content tree, so state toggles only trigger updates for the modals themselves.
