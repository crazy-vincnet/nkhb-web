## 2024-05-14 - Isolate Modal State from App Component
**Learning:** In the React application (`src/public`), modal states (e.g., `isArticleModalOpen`) are triggered via `window.postMessage` events from deeply nested child components. If these states are placed in the root `App.tsx`, every modal trigger causes the entire application to re-render.
**Action:** Extract the modal states into a separate `<Modals />` component wrapped in `React.memo` and place it inside the `<Router>` (to avoid static analysis issues). This prevents full-page re-renders on modal state changes.
