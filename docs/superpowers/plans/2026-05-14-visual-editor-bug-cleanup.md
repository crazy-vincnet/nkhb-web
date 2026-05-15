# Visual Editor: Bug Discovery & Resolution Plan

## 1. Goal
Ensure the Visual Editor is 100% stable, data-accurate, and synchronized across all languages and devices.

## 2. Identified High-Priority Areas

### Area A: Image & Logo Persistence
- **Symptom**: Changes appear in sidebar but not on live site.
- **Root Cause Analysis**: 
    1. Key mismatch (`image_logo` vs `logo_url`). (Partially Fixed)
    2. Data priority conflict (`style_props.link` vs `value_ko/en`). (Partially Fixed)
    3. Missing state synchronization between Iframe and Parent during the initial upload handshake.

### Area B: Language Synchronization (/en path)
- **Symptom**: Navigating to /en shows Korean content.
- **Root Cause Analysis**:
    1. Static `en/index.html` directory redirecting before the SPA can boot.
    2. `I18nProvider` not listening to the query parameter `?lang=en` used by the redirect.
    3. Inconsistent key usage in static translations vs dynamic DB entries.

### Area C: Save & Database Constraints
- **Symptom**: "UUID validation failed" or "Duplicate row conflict" errors.
- **Root Cause Analysis**:
    1. Temporary IDs starting with `new-` being sent to UUID columns.
    2. Bulk upserts containing duplicate keys in the same batch.

## 3. Systematic Testing Script (Manual/Pseudo-Code)

I will run through these scenarios in the next turns:
1. **Scenario: Logo Swap**
   - Action: Upload new logo in KO. Save. Switch to EN. Upload another logo. Save.
   - Verification: Check DB `logo_url` row. Verify site shows different logos based on `?lang=`.
2. **Scenario: Section Move & Undo**
   - Action: Move 'Support' to top. Undo. Redo. Save.
   - Verification: Refresh iframe. Check if order persists.
3. **Scenario: Deep Link Language**
   - Action: Go to `.../en/about`.
   - Verification: Confirm `lang` is 'en'. Confirm no redirect loops.

## 4. Execution Plan (Parallel Refinement)

### Turn 1: Asset Logic Cleanup
- Unify ALL logo keys in `Header`, `Footer`, and `i18n.tsx`.
- Refactor `getContent` to strictly prioritize the language-specific field for all image assets.

### Turn 2: Routing & Redirection Fix
- Remove the legacy `en/index.html` file to allow the React SPA to handle the `/en` route directly.
- Standardize query param usage across the entire project.

### Turn 3: State & History Hardening
- Audit `Content.tsx` for any stale state usage (adding more refs if needed).
- Ensure `handleSave` deduplicates keys globally across all tabs.

### Turn 4: Final Validation
- Full project build.
- Multi-browser URL testing.
