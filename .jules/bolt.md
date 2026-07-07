
## 2024-06-28 - [Extracting Root Modal State to Prevent Re-renders]
**Learning:** Having modal states at the top level of a large React app triggers full-page re-renders.
**Action:** Always extract top-level non-context state variables into specialized components (like a Modal wrapper) and wrap them in `React.memo` to isolate updates.
