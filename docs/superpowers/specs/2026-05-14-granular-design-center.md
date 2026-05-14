# Design Spec: Comprehensive Design & Content Center

**Date:** 2026-05-14  
**Topic:** Granular Content & Style Management  
**Status:** Draft (Pending User Review)

## 1. Overview
The goal is to transform the Content Center into a "Site Editor" where admins can modify not just text, but also links and visual styles (font size, color) for every individual element. This provides maximum flexibility without redeploying code.

## 2. Technical Architecture

### 2.1. Database Evolution
Add a `style_props` JSONB column to the `content` table.
- **Table**: `content`
- **New Column**: `style_props` (JSONB)
- **Schema Example**:
  ```json
  {
    "fontSize": "3rem",
    "color": "#E67E5F",
    "link": "https://example.com",
    "fontWeight": "bold"
  }
  ```

### 2.2. Internationalization (i18n) Engine Upgrade
Update `src/public/lib/i18n.tsx` to return objects containing both text and styles.
- New `useStyle(key)` hook: Retrieves style properties for a specific key.
- Updated `t(key)`: Continues to return the translated string (for backward compatibility).
- New `getContent(key)`: Returns `{ text: string, styles: CSSProperties, link: string }`.

### 2.3. Admin Interface (Content Center Rebuild)
A multi-layered editor:
1. **Section Navigator**: Top-level tabs (Hero, About, etc.).
2. **Element Groups**: Cards/Accordions grouping related keys.
3. **Property Editor**: For each element, show:
   - **Text Editor**: KO/EN side-by-side.
   - **Style Editor**: Color pickers, Font size sliders.
   - **Link Editor**: URL input field.

## 3. Implementation Plan (Parallel Workstreams)

### Stream A: Database & Backend
1. Create migration to add `style_props` column.
2. Update Supabase types/interfaces.

### Stream B: i18n & Component Integration
1. Refactor `I18nProvider` to fetch and distribute `style_props`.
2. Update `Hero.tsx`, `Background.tsx`, etc., to apply dynamic styles.

### Stream C: Admin UI
1. Build the new hierarchical layout.
2. Implement property-specific input components (ColorPicker, SizeSlider).

## 4. Success Criteria
- All text on the landing page is editable.
- All links (buttons, "Learn More", etc.) are editable.
- Key visual properties (Hero title size, Brand colors) can be changed from Admin.
- The site remains fast and accessible.

---

**Question for the User**:
"Individual element styling" means you could potentially have hundreds of settings. To keep it organized, should I prioritize a **Visual Preview (WYSIWYG)** where you click on the site element to edit it, or a **Structured Form (Sidebar/Cards)** where everything is listed in order?
