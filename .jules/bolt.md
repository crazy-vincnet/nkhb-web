## 2024-09-27 - [Optimize i18n lookup]
**Learning:** Found an O(n) array search inside a high-frequency render loop hook (`getContent` calling `dbContent.find`). In highly localized React apps, this O(n) lookup occurs for every translated string on the page during render, becoming a performance bottleneck.
**Action:** Always memoize dictionary-like arrays into a `Map` structure for O(1) lookups when they are frequently accessed during render cycles.
