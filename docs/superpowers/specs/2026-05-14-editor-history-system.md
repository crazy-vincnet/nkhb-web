# Design Spec: Visual Editor History (Undo/Redo)

**Date:** 2026-05-14  
**Topic:** Ultra-High Optimization - Workspace Reliability  
**Status:** Draft (Pending User Review)

## 1. Overview
The History System provides a safety net for administrators by allowing them to revert (Undo) or re-apply (Redo) changes during an editing session. This encourages experimentation by making all actions reversible.

## 2. Technical Architecture

### 2.1. The History Stack
We will implement a dual-stack architecture:
- **Undo Stack**: Stores previous states of the entire `items` and `themeSettings` array.
- **Redo Stack**: Stores states that were "undone" so they can be re-applied.
- **Maximum Depth**: 50 steps (to manage memory efficiency).

### 2.2. Smart Capture Logic (Option 2)
To avoid filling the history with every single character typed (which would make Undo tedious), we will capture states at "significant" points:
- **Text/Link Inputs**: Capture state on `onBlur` (when the user finishes typing and leaves the field).
- **Color Pickers/Sliders**: Capture state on `onChangeEnd` or after a short debounce (e.g., 500ms of inactivity).
- **Structure Changes**: Capture state immediately after a drag-and-drop operation is completed.

### 2.3. Admin Interface Integration
1. **Top Bar Controls**: Add two icons next to the Page Navigation:
   - `RotateCcw` (Undo): Reverts to the previous state. Disabled if stack is empty.
   - `RotateCw` (Redo): Re-applies the next state. Disabled if redo stack is empty.
2. **Keyboard Shortcuts**:
   - `Cmd + Z` / `Ctrl + Z`: Trigger Undo.
   - `Cmd + Shift + Z` / `Ctrl + Y`: Trigger Redo.

## 3. Implementation Plan

### Stream A: History Hook
1. Create a custom `useHistory` hook to encapsulate stack management.
2. Implement `push(state)`, `undo()`, and `redo()` functions.
3. Integrate this hook into `Content.tsx`.

### Stream B: Event Integration
1. Refactor `updateItem` and `updateTheme` to support "intermediate" vs "final" updates.
2. Only `push` to history when a change is finalized (onBlur/debounced).

### Stream C: UI & Shortcuts
1. Add Undo/Redo buttons to the editor header.
2. Implement global event listener for keyboard shortcuts.

## 4. Success Criteria
- User can change a color, then click Undo to restore the previous color.
- Typing in a text field followed by clicking outside creates exactly one history entry.
- Moving a section in the Structure tab is fully reversible.
- Redo accurately restores the state after an Undo.
