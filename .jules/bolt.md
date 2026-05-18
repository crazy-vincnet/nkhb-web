## 2024-05-15 - [React re-renders in Home.tsx]
**Learning:** Managing modal states at the page level in `src/public/pages/Home.tsx` causes unnecessary full-page re-renders for all static section components since inline anonymous functions were used as event handlers.
**Action:** Wrapped event handlers in `useCallback` and child section rendering in `React.memo` to prevent re-renders of complex layout sections when modal states change.
