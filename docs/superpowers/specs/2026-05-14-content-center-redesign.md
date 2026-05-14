# Design Spec: Content Center Redesign

**Date:** 2026-05-14  
**Topic:** Content Center UI/UX Overhaul  
**Status:** Draft (Pending User Review)

## 1. Overview
The current Content Center is functional but becomes difficult to manage as the number of translation keys grows. This redesign aims to improve efficiency by introducing a multi-level hierarchy (Sections > Groups > Elements), adding specialized editors for links, and enhancing the overall visual organization.

## 2. Key Requirements
- **Hierarchical Organization**: Divide content not just by top-level sections but also by logical element groups within those sections using an accordion or card-based layout.
- **Specialized Field Types**:
    - **Text**: Standard i18n string editing.
    - **Link/URL**: Dedicated input for links with validation and visual indicators.
    - **Media**: Image URL management with integrated upload and preview.
- **Enhanced Usability**:
    - Global search functionality to find keys or values across all sections.
    - Floating action bar for saving changes, reducing the need to scroll back to the top.
    - Side-by-side bilingual editing (KO/EN).

## 3. User Interface Design

### 3.1. Navigation & Layout
- **Top Level**: Horizontal tab bar for major sections (Hero, About, Ministry, etc.).
- **Search Bar**: A global search input in the header that filters items regardless of the active tab.
- **Section View**: Within each section, content is displayed as a vertical list of **Cards**. Each card represents a logical group (e.g., "Main Banner Title Group").

### 3.2. Element Cards (Accordion Style)
- **Header**: Group title and item count.
- **Body**: A grid or list of specific keys.
- **Fields**:
    - Label (User-friendly name)
    - Key (Technical ID, e.g., `hero_title`)
    - KO Input (Textarea or Text field)
    - EN Input (Textarea or Text field)
    - Link Input (if applicable)

### 3.3. Specialized Inputs
- **Link Field**: Displays a link icon. Supports both internal paths (`/about`) and external URLs (`https://...`).
- **Image Field**: Shows a thumbnail preview. Includes an "Upload" button that interacts with Supabase Storage and updates the URL field.

### 3.4. Interaction Model
- **Floating Save Bar**: A sticky component at the bottom that activates when any field is modified.
    - Buttons: "Revert Changes" and "Save X Items".
- **Bilingual Sync**: A "Sync from KO" button for each EN field to quickly copy content for translation.

## 4. Technical Architecture
- **State Management**:
    - `content`: Array of all items fetched from Supabase.
    - `modifiedIds`: A Set of IDs that have been changed but not saved.
    - `activeTab`: ID of the current top-level section.
    - `searchQuery`: Current string being searched.
- **Data Model**:
    - Use the existing `content` table schema: `id`, `key`, `value_ko`, `value_en`.
    - Logical grouping will be handled purely in the UI based on key naming conventions (e.g., keys starting with `hero_` go to Hero section, then grouped by secondary prefix).

## 5. Success Criteria
- Admins can find any specific translation key within 3 clicks or via search.
- Editing links is intuitive and clearly separated from plain text.
- Large sections (like Hero) feel manageable due to grouping.
- Saving changes is always accessible via the floating bar.
