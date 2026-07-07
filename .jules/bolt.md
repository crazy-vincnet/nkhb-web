## 2024-06-27 - [Prevented App-wide re-renders from deep component modal triggers]
**Learning:** In this Vite/React 18 multi-page architecture (`src/public`), root-level state (e.g., `isArticleModalOpen` in `App.tsx`) controlled via `window.postMessage` events causes the entire application (including `<Router>`, `<Header>`, `<Footer>`) to re-render.
**Action:** Always encapsulate global overlay/modal state into independent wrapper components (like `<Modals />`) and wrap them in `React.memo` to isolate the re-render boundary strictly to the modals themselves.
