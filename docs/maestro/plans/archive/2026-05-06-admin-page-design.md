# Admin Page & Supabase Migration Design Document

## Goals
1. Provide an admin interface to manage "Letters of Hope" (희망의 편지) submissions.
2. Provide an admin interface to manage audio tracks (upload, edit, delete).
3. Provide an admin interface to manage broadcast schedule and website text content.
4. Migrate the backend from Google Apps Script and hardcoded data to Supabase for better scalability and security.

## Architecture
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for MP3 audio files)
- **Authentication**: Supabase Auth (Admin login)
- **Frontend (Main)**: Existing Vanilla JS website (updated to fetch from Supabase)
- **Frontend (Admin)**: New React (SPA) dashboard

## Database Schema
- `letters`: user submissions (name, location, email, reason, message, created_at)
- `audio_tracks`: broadcast audio info (title_ko, title_en, url, order, is_active)
- `schedule`: broadcast time/freq (day, time, frequency, is_active)
- `content`: dynamic UI text (key, value_ko, value_en)

## Security
- Row Level Security (RLS) on all tables.
- Public can ONLY insert into `letters` and select from other tables.
- Authenticated admin has full CRUD access to all tables.