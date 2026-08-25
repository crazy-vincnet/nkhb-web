## 2024-08-25 - Isolate Root-Level Modal State to Prevent Full-Page Re-renders
**Learning:** In this multi-page React setup wrapped with a `Router`, keeping modal states directly in the root `App` component caused a full-page re-render every time a modal was triggered via `window.postMessage`.
**Action:** Isolate generic, cross-page state (like global modals) into a separate component wrapped with `React.memo`, placing it effectively alongside routing content but managing its state independently to prevent unnecessary full app renders.
