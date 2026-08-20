## 2024-10-24 - Prevent Top-Level Route Re-renders via State Isolation
**Learning:** In the React application, keeping modal visibility state (e.g., `isArticleModalOpen`) and event listeners inside the root `App.tsx` component triggers full-page re-renders across all active routes and child components whenever a modal opens or closes.
**Action:** Isolate global overlay/modal state into a separate `<Modals />` component, wrap it with `React.memo`, and place it inside the `<Router>` hierarchy so that modal toggles do not unnecessarily re-render the entire application tree.
