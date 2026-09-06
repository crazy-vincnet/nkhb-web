## 2024-05-19 - Extracted Modals from App.tsx
**Learning:** Having `isArticleModalOpen`, `isLetterModalOpen`, and `isSampleModalOpen` inside `App.tsx` triggers a full-page re-render of `<App />` (and therefore `<Routes>`, `<Header>`, `<Footer>`) every time a modal is opened or closed via `window.postMessage`.
**Action:** Isolate modal state in a `<Modals />` component wrapped with `React.memo` to prevent unnecessary full application tree re-renders. Place it inside `<Router>` so it can access context if needed.
