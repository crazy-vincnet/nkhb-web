## 2024-05-24 - Optimize i18n content lookups to O(1)
**Learning:** Frequent O(N) lookups in core React context functions (`getContent` in `useI18n`) can silently degrade rendering performance as the translation dataset grows. `Array.prototype.find()` on every string on every render is a common bottleneck.
**Action:** Always memoize arrays into Maps/Sets using `useMemo` when they are used for high-frequency key-value lookups in render functions or context providers.
