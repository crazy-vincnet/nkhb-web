## 2024-05-24 - Isolate Modal State to Prevent Full-Page Re-renders
**Learning:** Keeping global UI states (like modal visibility controlled via window messages) in the root `App.tsx` component causes the entire application tree, including the `<Router>` and all nested routes, to re-render whenever a modal opens or closes.
**Action:** Extract top-level modal logic and state into an isolated wrapper component (`<Modals />`), wrapped in `React.memo()`, and render it alongside other top-level elements to ensure only the modal UI re-renders on state changes.
