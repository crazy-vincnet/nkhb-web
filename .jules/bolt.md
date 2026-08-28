## 2024-05-14 - Isolate top-level modal state
**Learning:** Extracting modal state from a top-level component (`App.tsx`) into an isolated, memoized child component (`Modals.tsx`) prevents unnecessary full-page re-renders across the entire route tree whenever a modal is toggled.
**Action:** When implementing app-wide overlays or modals triggered via global events (like `postMessage`), isolate their state in a dedicated sibling component outside the main content rendering path to maintain optimal rendering performance.
