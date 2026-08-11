
## 2024-08-11 - State Colocation for Modals
**Learning:** Extracting global page-level states (like multiple modals controlled by window events) from a top-level route component (`App.tsx`) into a dedicated wrapper (`<Modals />`) prevents the entire page tree (Header, Router, Footer) from re-rendering when a single modal opens or closes.
**Action:** When implementing application-wide overlays or modals that rely on global events, always encapsulate their state in a separate isolated component wrapped in `React.memo` rather than managing them at the root level.
