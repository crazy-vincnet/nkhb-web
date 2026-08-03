## 2024-05-24 - Initial

## 2024-05-24 - Extracting page-level state to avoid full re-renders
**Learning:** In a single-page React application using react-router, putting modal state (and the global event listener for them) at the top-level `App` component will cause the entire application route structure and nested components to re-render every time a modal is opened or closed.
**Action:** Isolate modal state and global event listeners into a dedicated `<Modals />` component, wrapping it with `React.memo`, and place it alongside the main app content. Use `useCallback` for functions passed as props to avoid breaking memoization.
