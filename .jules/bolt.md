## 2024-05-30 - Prevent Root State Render Cascades in Vite/React Router Architecture

**Learning:** This codebase places modal state (e.g., `isArticleModalOpen`) at the very top level in `App.tsx` because it uses a global message bus (`window.postMessage`) for deeply nested child components to trigger modals. Because modal state is at the root, every time a modal toggles, the entire `<Router>` tree, including `Home.tsx` and all its deeply nested complex static page sections, experiences a full render cycle.

**Action:** When a global/root state architectural pattern forces entire page re-renders, it's critical to isolate expensive or static UI segments. Use `useCallback` for event handler props passed down from the routed page component (like `Home.tsx`), and wrap the large visual static section components (like `Background.tsx`, `Composition.tsx`, `Guide.tsx`) with `React.memo` (without `React.FC` typing) to short-circuit the React render cascade triggered by root state updates.
