## 2024-05-19 - Isolate React Modals to Prevent Full-Page Re-renders
**Learning:** By default, placing modals in the top-level route element (`App.tsx`) with page-level state triggers full-page re-renders whenever a modal is toggled. This codebase handles modal triggers via `window.postMessage`, compounding the issue.
**Action:** Isolate modal state within a single `<Modals />` component wrapped in `React.memo` and place it inside the router context to avoid unnecessary re-renders of unrelated application views while maintaining context access.
