
## 2024-07-03 - Avoid Root Level Modal State
**Learning:** Placing isolated event-driven state (like a modal trigger) at the root `App.tsx` level triggers full-page re-renders across all child routes and layout components.
**Action:** Extract specific independent state managers (like modal listeners) into child components and wrap them in `React.memo` to isolate their re-render cycle from the rest of the application tree.
