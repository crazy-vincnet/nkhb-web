## 2024-05-24 - Isolate modal states to prevent full-page re-renders
**Learning:** Full page re-renders can be triggered when global app state changes, especially with context or top-level component state. In React, isolated states such as Modals that rely on deep prop-drilling or events (like `window.postMessage`) should be decoupled into smaller sub-components.
**Action:** Isolate modal state components by creating a dedicated `<Modals />` component to encapsulate the event listener logic and local states, and wrap it in `React.memo`.
