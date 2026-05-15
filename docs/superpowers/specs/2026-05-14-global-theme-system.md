# Design Spec: Global Theme System (Theme Editor)

**Date:** 2026-05-14  
**Topic:** Ultra-High Optimization - Global Design Authority  
**Status:** Draft (Pending User Review)

## 1. Overview
The Global Theme System allows administrators to change the entire site's visual identity (colors, fonts, shapes, spacing) from a single interface. This eliminates the need for per-element styling when broad changes are desired.

## 2. Technical Architecture

### 2.1. CSS Variable Architecture
The site already uses CSS variables in `:root` (e.g., `--primary-color`, `--accent-color`). We will extend this and make them dynamic.
- **Dynamic Injection**: `I18nProvider` (or a dedicated `ThemeProvider`) will fetch a `global_theme_settings` key from the database.
- **Runtime Overrides**: These values will be injected as inline styles on the `document.documentElement`, overriding the static `style.css` values.

### 2.2. Theme Configuration Schema
Stored in the `style_props` of a content item with key `global_theme_settings`.
```json
{
  "colors": {
    "primary": "#000000",
    "accent": "#004a99",
    "accentLight": "#e6efff",
    "secondary": "#751e26"
  },
  "typography": {
    "baseSize": "16px",
    "headingFont": "Pretendard",
    "bodyFont": "Pretendard"
  },
  "ui": {
    "borderRadius": "24px",
    "sectionPadding": "120px",
    "buttonPadding": "12px 24px"
  }
}
```

### 2.3. Admin Interface (THEME Tab)
A new "THEME" tab in the Visual Editor sidebar containing:
1. **Brand Colors**: 4-5 color pickers for primary, accent, and secondary colors.
2. **Typography**: Sliders for base font size and dropdowns for font selection (if integrated).
3. **Buttons & Shapes**: Sliders for global border-radius and shadow intensity.
4. **Layout & Spacing**: Sliders for section vertical padding (`--section-padding`).

### 2.4. Real-time Preview
- When a slider or color picker is moved, a `NKHB_LIVE_THEME_UPDATE` message is sent to the iframe.
- The site preview instantly updates the CSS variables on its `<html>` tag, reflecting changes site-wide immediately.

## 3. Implementation Plan

### Stream A: Core Theme Engine
1. Update `I18nProvider` to handle `global_theme_settings`.
2. Implement a `useTheme` hook to inject variables into the DOM.

### Stream B: Admin UI (Theme Tab)
1. Add "THEME" tab to `Content.tsx`.
2. Build standardized control components (ColorRow, RangeSlider, SelectRow).
3. Implement the `postMessage` bridge for theme updates.

### Stream C: Style Refactoring
1. Audit `style.css` to ensure all hardcoded values are replaced with their respective variables.
2. Update components to rely on variables for default styles.

## 4. Success Criteria
- Changing the "Accent Color" in the Theme tab updates all primary buttons and highlights site-wide.
- Adjusting "Section Padding" increases/decreases the space between all sections instantly.
- "Border Radius" slider makes all cards and buttons sharper or rounder in real-time.
- Settings persist across sessions and pages.
