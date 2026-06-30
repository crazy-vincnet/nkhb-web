
## 2024-06-25 - Prevent Full-Page Re-renders from Global State in React
**Learning:** In a React application, managing global UI state (like modal visibility) at the top level of the app (e.g., in `App.tsx`) forces the entire component tree below it to re-render whenever the state changes. In this codebase, opening a modal caused the Router, Header, Footer, and page content to re-render unnecessarily.
**Action:** Extract global UI states into dedicated, isolated components placed exactly where they are needed, and wrap those components in `React.memo` to decouple their render cycle from the parent's state updates.
