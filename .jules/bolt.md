## 2024-05-24 - React Router re-renders with Root State
**Learning:** In this Vite/React 18 architecture, modal state is managed at the root `App.tsx` via `window.postMessage`. Because inline arrow functions were passed as props down to section components in `Home.tsx`, every modal toggle caused the entire page of heavy components to re-render.
**Action:** Always wrap `window.postMessage` handlers in `useCallback` and wrap static section components with `React.memo` (without `React.FC` type annotation) when they are descendants of a root state provider.
