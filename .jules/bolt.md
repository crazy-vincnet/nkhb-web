## 2026-08-10 - Extracting Page-Level State to Prevent Full-Page Re-renders
**Learning:** In the React application, keeping modal state in the root App component triggers full-page re-renders on state changes. Isolating this state in a separate `<Modals />` component wrapped in `React.memo` optimizes performance.
**Action:** When implementing global modals or similar page-level UI overlays, isolate their state and event listeners into a dedicated memoized component rather than placing them in the root App.tsx.
