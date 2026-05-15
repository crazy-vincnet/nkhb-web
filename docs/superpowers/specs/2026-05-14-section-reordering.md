# Design Spec: Section Reordering (Drag and Drop)

**Date:** 2026-05-14  
**Topic:** Ultra-High Optimization - Dynamic Page Structure  
**Status:** Draft (Pending User Review)

## 1. Overview
Currently, the order of sections on pages like Home and About is hardcoded in the React components (`<Hero />`, `<Background />`, etc.). This feature will introduce a dynamic rendering engine that allows administrators to change the order of these sections using a drag-and-drop list in the Visual Editor's sidebar.

## 2. Technical Architecture

### 2.1. Data Storage
Instead of creating a new database table, we will leverage the existing `content` table's JSONB capabilities.
- **Key**: `page_layout_home` and `page_layout_about`
- **Value**: A JSON array of section identifiers representing the render order.
- **Example (`value_en` or `style_props`)**:
  ```json
  ["hero", "background", "composition", "effects", "quote", "reach", "guide", "support", "schedule"]
  ```

### 2.2. Dynamic Rendering Engine (Frontend)
Pages like `Home.tsx` will no longer hardcode component tags.
1. Create a **Component Registry**: A dictionary mapping string IDs to React components.
   ```tsx
   const SECTION_MAP = {
     hero: Hero,
     background: Background,
     // ...
   };
   ```
2. The page will fetch the `page_layout_*` array from the `useI18n` context.
3. It will iterate over the array and render the corresponding components from the registry dynamically.

### 2.3. Admin Interface (Visual Editor)
- **New Control Panel**: Add a "PAGE STRUCTURE" button or section in the sidebar.
- **Drag-and-Drop List**: Display the active page's sections as a vertical list of draggable cards.
- **HTML5 Drag & Drop**: Utilize native browser drag-and-drop events (`onDragStart`, `onDragOver`, `onDrop`) to reorder the list items without adding heavy third-party dependencies.
- **Live Sync**: When the order changes in the sidebar, the `page_layout` state updates, causing the iframe preview to instantly re-render the sections in the new order.
- **Save Mechanism**: Clicking "SAVE ALL" pushes the new JSON array to Supabase.

## 3. Scope & Constraints
- **Scope**: Home Page and About Page sections. Header, Footer, and Modals remain fixed.
- **Fallback**: If the database does not contain a layout array (e.g., initial load), the system will fallback to the default hardcoded order.
- **Dependencies**: Native HTML5 Drag and Drop API to minimize bundle size.

## 4. Success Criteria
- The admin can open the "Structure" panel in the Visual Editor.
- They can drag a section (e.g., "Support") above another section (e.g., "Hero").
- The preview iframe instantly reflects this change.
- Refreshing the live site shows the new order.
