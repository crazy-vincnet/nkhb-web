# Implementation Plan: Admin Page & Supabase Migration

## Phases

### Phase 1: Database Initialization (Supabase)
- **Agent**: `data_engineer`
- **Tasks**:
  1. Create SQL migration scripts for tables: `letters`, `audio_tracks`, `schedule`, `content`.
  2. Define RLS (Row Level Security) policies for public and admin roles.
  3. Set up initial data/seeds if necessary.
- **Files**: `supabase/migrations/20260506_init.sql`
- **Parallel**: false
- **Blocked By**: []

### Phase 2: Main Website Refactoring
- **Agent**: `coder`
- **Tasks**:
  1. Integrate Supabase JS client via CDN.
  2. Refactor `script.js` to fetch audio tracks from Supabase instead of hardcoded array.
  3. Refactor `script.js` to fetch schedule and dynamic content.
  4. Update letter submission form to insert into Supabase `letters` table.
- **Files**: `index.html`, `script.js`, `lang.js`
- **Parallel**: false
- **Blocked By**: [1]

### Phase 3: Admin Dashboard (React)
- **Agent**: `coder`
- **Tasks**:
  1. Initialize React app in `admin/` directory using Vite.
  2. Implement login page with Supabase Auth.
  3. Create dashboard layout with sidebar.
  4. Implement CRUD for Letters, Audio, Schedule, and Content.
- **Files**: `admin/**/*`
- **Parallel**: false
- **Blocked By**: [1]

### Phase 4: Validation & Testing
- **Agent**: `tester`
- **Tasks**:
  1. Test public letter submission.
  2. Test admin login and CRUD operations.
  3. Verify data synchronization between admin and main site.
- **Files**: []
- **Parallel**: false
- **Blocked By**: [2, 3]
