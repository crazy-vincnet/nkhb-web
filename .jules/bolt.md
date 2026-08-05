## 2024-05-24 - Extracted Modal State from App.tsx
**Learning:** Modals triggered by `window.postMessage` in `App.tsx` cause the entire app to re-render.
**Action:** Extract modal state and event listeners into a dedicated `<Modals />` component wrapped in `React.memo()` and placed inside the router context to isolate state updates and prevent top-level route re-renders.