## 2024-05-18 - Isolate React Modal Re-renders
**Learning:** In the root `App.tsx`, maintaining state for multiple modals triggered full application re-renders whenever a modal was opened or closed.
**Action:** Extract modal state and rendering into an isolated `<Modals />` component, leveraging `React.memo` and `useCallback` to prevent unnecessary root-level React rendering.
