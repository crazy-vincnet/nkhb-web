
## 2024-05-30 - Prevent Root Re-renders from Deeply Nested Modals
**Learning:** In a React app relying on global window events (`postMessage`) to trigger modals, placing that state directly in the root component (like `App.tsx`) causes massive, unnecessary full-tree re-renders (including routers, headers, and heavy page content) on every open/close interaction.
**Action:** Always colocate state as far down the React tree as possible. If state is inherently global but only visually isolated components (like modals) depend on it, extract those components into a separate, memoized wrapper (e.g., `<Modals />`) and listen to the events *inside* that wrapper to isolate the render blast radius.
