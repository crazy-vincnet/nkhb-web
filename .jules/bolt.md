## 2024-05-18 - [React Router Re-renders]
**Learning:** In a React application, placing global modal states at the root component level (like `App.tsx`) causes full-page re-renders (including the `<Router>`, active page, headers, and footers) every time a modal is opened or closed.
**Action:** Extract modal states and global event listeners into a dedicated `<Modals />` component wrapped in `React.memo`, placed outside the main layout/route structures to isolate state changes and prevent unnecessary rendering of unrelated, heavy components.
