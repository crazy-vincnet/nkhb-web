# Implementation Plan: Unified React MPA Refactor

## Phases

### Phase 1: Project Restructuring & Vite Setup
- **Agent**: `devops_engineer`
- **Tasks**:
  1. Create root `package.json` with all dependencies.
  2. Create `vite.config.ts` for MPA (multiple entry points).
  3. Set up directory structure: `src/public`, `src/admin`, `public/`.
  4. Move current `admin/src` to `src/admin`.
  5. Configure Tailwind at root to only target `src/admin`.
- **Files**: `package.json`, `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`
- **Parallel**: false
- **Blocked By**: []

### Phase 2: Public Site React Conversion (Structure & UI)
- **Agent**: `coder`
- **Tasks**:
  1. Convert `index.html` structure into React components in `src/public/`.
  2. Integrate existing `style.css` into the public React entry.
  3. Implement `About` page as a React component.
  4. Set up i18n context/hook based on `lang.js`.
- **Files**: `src/public/**/*`
- **Parallel**: false
- **Blocked By**: [1]

### Phase 3: Public Site React Conversion (Logic & Integration)
- **Agent**: `coder`
- **Tasks**:
  1. Implement Supabase data fetching for Audio, Schedule, and Content.
  2. Implement Audio Player logic (playing, track switching).
  3. Implement Letter Submission form logic.
  4. Implement modal and navigation toggles.
- **Files**: `src/public/**/*`
- **Parallel**: false
- **Blocked By**: [2]

### Phase 4: Final Cleanup & Validation
- **Agent**: `tester`
- **Tasks**:
  1. Delete old vanilla files (`about.html`, `script.js`, `lang.js`, etc.).
  2. Verify build process for both MPA entries.
  3. Final audit of functionality and styling.
- **Files**: []
- **Parallel**: false
- **Blocked By**: [3]
