## 2024-05-24 - Extracted Modals Component
**Learning:** Having un-memoized component states that are updated by top-level event listeners within `App.tsx` triggers unnecessary full-page re-renders.
**Action:** Extract modals and similar stateful layers into a separate component wrapped with `React.memo` to isolate rendering outside of the main application tree whenever possible.
