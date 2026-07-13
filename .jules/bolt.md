
## 2024-05-30 - Prevent Full-Page Re-renders from Modal State
**Learning:** In the React application (`src/public`), isolating page-level states such as modals into their own nested component and wrapping that component with `React.memo` prevents unnecessary full-page re-renders. We observed that the `App` component previously tracked multiple modal open states (`isArticleModalOpen`, `isLetterModalOpen`, `isSampleModalOpen`), triggering global updates.
**Action:** When working on application-wide modal integrations or state that is decoupled from the main route paths, separate that state into a distinct nested component, place it under the routing context, and wrap it with `React.memo()`.
