
## 2024-05-30 - Prevented App Re-renders by Extracting Modal State
**Learning:** In React multi-page setups using `react-router-dom`, placing global UI state (like `isModalOpen`) directly in the top-level `App` component is a significant performance anti-pattern. Because modal visibility often changes frequently via user interactions, modifying this state triggers a full re-render of the entire tree, including the heavy `<Router>` and all nested page components, even if they didn't change.
**Action:** Always extract top-level non-routing state into isolated sibling components (e.g., `<Modals />`), wrapped in `React.memo` if necessary. This allows modals to re-render independently without forcing the rest of the application tree to reconcile.
