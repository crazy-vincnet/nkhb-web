## 2024-05-24 - Extracted Modals from App root
**Learning:** Extracting modal state from a top-level routing component (like `App.tsx`) is critical in React when global event listeners are used to trigger UI changes. Without this, dispatching a `postMessage` to open a single modal forces the entire application tree to re-render needlessly.
**Action:** Always encapsulate isolated UI states (such as popups, toasts, and modals) into their own components and memoize them so that global state changes do not cascade through expensive static components or routers.
