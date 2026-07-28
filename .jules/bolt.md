## 2025-02-18 - Isolate Application Modal State

**Learning:** Keeping boolean visibility state for globally accessible UI elements (like modals triggered by `postMessage`) in the root `App` component causes unnecessary full-page re-renders. Every time a user opened a modal in this application, the entire component tree—including the router, header, footer, and currently active route components—was forced to re-render, despite those elements remaining visually unchanged.

**Action:** Extract top-level generic UI overlays (like modals, toasts, or tooltips) into a dedicated wrapper component (e.g., `<Modals />`). Place this component inside the `Router` context but outside the main view container. Manage the visibility state and event listeners exclusively within this wrapper, and utilize `React.memo` and `useCallback` to prevent it from re-rendering unless absolutely necessary. This strictly isolates the render cycle of the modal from the rest of the application.
