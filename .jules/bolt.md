## 2024-08-07 - Isolate Modal State

**Learning:** Managing modal visibility state (e.g., `isArticleModalOpen`) at the root level of the application (`App.tsx`) causes unnecessary full-page re-renders across all child components whenever a modal is toggled.
**Action:** Extract global overlay states (like modals, tooltips) into independent, isolated components (e.g., `<Modals />`) wrapped in `React.memo` and placed as peers to the main application content. This prevents the entire tree from re-rendering during state updates.
