## 2024-06-24 - Root App Re-renders due to Global Modal State
**Learning:** In the Vite React app structure (`src/public/App.tsx`), managing global modal states directly in the root `<App>` component caused full-app re-renders (including Router and all pages) whenever a modal opened/closed via `window.postMessage`.
**Action:** Extract global UI states (like modals) into separate isolated components (`<Modals />`) wrapped in `React.memo` to restrict re-render scope strictly to the modal tree.
