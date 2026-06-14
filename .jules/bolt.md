## 2023-10-27 - [Page-level Modal State Re-renders]
**Learning:** Page-level modal state management via `window.postMessage` in `App.tsx` mandates `React.memo` usage in children to avoid deep React component re-rendering tree issues.
**Action:** When a top-level component manages state via messaging, make sure to use `useCallback` for event dispatchers and wrap children in `React.memo`.
