## 2024-05-24 - Isolate App State

**Learning:** Isolating top-level application states (such as modals in `App.tsx`) to nested, memoized wrapper components (e.g., `<Modals />` wrapped in `React.memo`) avoids unnecessary re-renders of the entire application and nested routes.

**Action:** Whenever introducing new global or page-level states, explicitly manage them in targeted container components rather than polluting the root application component.
