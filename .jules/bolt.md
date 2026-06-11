## 2024-06-11 - [Optimize Modal Re-renders]
**Learning:** In the React application, modal states managed at the root `App.tsx` level cause full-page re-renders because nested route components are recreated. Deeply nested child section components re-render unless event handlers are stabilized with `useCallback` and the components are wrapped in `React.memo`.
**Action:** Use `useCallback` for event handler props and `React.memo` for static child section components to prevent cascading re-renders when global UI state (like modals) changes.
