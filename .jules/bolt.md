## 2024-08-19 - Isolate modal state to prevent full-page re-renders
**Learning:** Modal visibility state triggered via `window.postMessage` in the root application component causes the entire app tree to re-render.
**Action:** Encapsulate modal state in a dedicated, isolated `<Modals />` component wrapped with `React.memo()` to confine state updates and prevent cascading re-renders across unaffected routes and components.
