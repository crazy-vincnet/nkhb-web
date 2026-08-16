## 2024-10-24 - Isolate Modal State to Prevent Full-Page Re-renders
**Learning:** In a multi-page Vite React application, placing shared state (like modal visibility) inside the top-level route component (`App.tsx`) causes full-page re-renders whenever a deeply nested child triggers a modal.
**Action:** Extract top-level generic state and event listeners into an isolated wrapper component (e.g. `<Modals />`) wrapped with `React.memo` to prevent main layout and child components from unnecessarily re-rendering when modals open or close.
