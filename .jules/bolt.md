## 2024-06-25 - Prevent Full-Page Re-renders from Modals
**Learning:** In a React application, putting state variables that open/close modals at the top level (e.g., in `App.tsx` alongside routes) causes a full-page re-render every time a modal is opened or closed. This is particularly noticeable and slow on heavy pages.
**Action:** Isolate modal state in a generic wrapper component (e.g., `<Modals />` wrapped in `React.memo`) that listens to global events (`window.postMessage`) instead of lifting the state up to the top level, avoiding unneeded re-renders.
