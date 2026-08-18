## 2026-08-18 - Extract Modals to prevent re-renders
**Learning:** Isolating modal state in a memoized `<Modals />` component prevents full-page re-renders when toggling modals via `window.postMessage`.
**Action:** Extract deeply nested state variables triggering wide-ranging effects to isolated, memoized parent wrappers rather than placing them at the top level route definition.
