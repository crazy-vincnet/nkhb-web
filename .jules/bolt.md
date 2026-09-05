## 2024-05-18 - Isolate React modal state to avoid full-page re-renders
**Learning:** Having un-isolated state for modals at the highest level of the application (`App.tsx`) caused unnecessary full-page re-renders across all route and nested components whenever a modal was opened or closed.
**Action:** Isolate modal state and logic by extracting them into a dedicated `<Modals />` component wrapped with `React.memo`, preventing full-page re-renders when managing modal states.
