
## 2024-08-26 - Isolate modal states to prevent full-page re-renders
**Learning:** Managing widespread UI states (like multiple Modals triggered via `window.postMessage`) at the top-level route component (`App.tsx`) causes full page re-renders across the entire layout on every state change.
**Action:** Extract application-wide floating UI elements into isolated memoized wrapper components (e.g., `<Modals />`) placed inside the top-level structure, so their state changes do not trigger re-renders in sibling route components.
