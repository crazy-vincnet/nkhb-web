---
design_depth: deep
task_complexity: complex
---

# Design Document: GrapesJS Visual CMS & SEO System

## 1. Problem Statement
The NKHB web platform currently uses a static React architecture (`Home.tsx`) and an `i18n.tsx` file for content management. This requires code deployments for layout changes or major content updates. The goal is to introduce a fully visual, drag-and-drop Content Management System (CMS) using GrapesJS into the Admin panel, allowing administrators to modify text, images, and the structural order of main page components natively in both Korean and English. Additionally, the system must support dynamic SEO metadata management to optimize search engine visibility.

## 2. Requirements
- **REQ-1:** GrapesJS must generate a JSON structure that maps precisely to existing React components (`Hero`, `Background`, `Composition`, etc.).
- **REQ-2:** The content architecture must use "Single Layout, Localized Fields", ensuring Korean and English layouts remain structurally synced while text is distinct.
- **REQ-3:** SEO metadata (Title, Description, Image) must be manageable via the Admin panel and injected client-side using `react-helmet-async`.
- **REQ-4:** Security: The admin panel must sanitize all inputs and strictly enforce RLS (Row Level Security) on new Supabase tables.

## 3. Approach

### Selected Approach: Standard GrapesJS + React Renderer
We will embed standard GrapesJS into a new `Pages.tsx` admin route. We will define custom GrapesJS blocks (e.g., `nkhb-hero`, `nkhb-schedule`) that mirror React components. They will hold localized attributes (`title_ko`, `title_en`). `Home.tsx` will fetch `layout_json` and recursively map nodes to React components.

**Alternatives Considered:**
- *Headless GrapesJS + Custom React UI:* Rejected due to the massive UI development effort required, which is disproportionate to the current need, even though it offers higher admin UI consistency.

## 4. Architecture & Data Flow

1.  **Admin UI (GrapesJS Editor):** We will embed standard GrapesJS into a new `Pages.tsx` admin route. *[Standard GrapesJS chosen — *fastest implementation while preserving layout integrity*]* `Traces To: REQ-1`
2.  **Custom Block Manager:** We will define custom GrapesJS blocks (e.g., `nkhb-hero`, `nkhb-schedule`) that mirror React components. They will hold localized attributes (`title_ko`, `title_en`).
3.  **Supabase Storage:** A new table `cms_pages` will store `slug`, `layout_json` (the GrapesJS node tree), and SEO columns (`seo_title_ko`, etc.). *[Single JSON payload chosen — *ensures KO and EN pages do not structurally drift*]* `Traces To: REQ-2`
4.  **Frontend Renderer:** `Home.tsx` will fetch `layout_json`. A recursive React mapping function will read the JSON nodes and render the corresponding React components.
5.  **SEO Provider:** `react-helmet-async` will wrap the app, injecting tags fetched from `cms_pages`. *[Client-side Helmet chosen — *preserves Vite SPA architecture without requiring SSR servers*]* `Traces To: REQ-3`

## 5. Agent Team
- `architect`: Oversee the structural changes and ensure React/GrapesJS alignment.
- `database_administrator`: Create the `cms_pages` table and configure RLS.
- `coder`: Implement the GrapesJS editor, custom blocks, and the React dynamic renderer.
- `seo_specialist`: Ensure `react-helmet-async` is correctly implemented for web crawlers.
- `security_engineer`: Audit JSON parsing and sanitize inputs to prevent XSS.

## 6. Risk Assessment
-   **Risk: XSS via GrapesJS JSON (Medium):** If an admin account is compromised, malicious JS could be injected into JSON attributes.
    -   **Mitigation:** The React renderer will strictly map predefined types and sanitize rich-text fields using `DOMPurify` before rendering. `Traces To: REQ-4`
-   **Risk: GrapesJS Editor Bundle Size (Medium):** GrapesJS is heavy and could slow down the Admin panel.
    -   **Mitigation:** We will code-split/lazy-load the GrapesJS editor component so it doesn't affect standard admin routes.

## 7. Success Criteria
- GrapesJS runs in the admin panel and can save layouts/SEO data to Supabase.
- The public site fetches the JSON layout and correctly renders the bilingual content using existing React components.
- Meta tags dynamically update based on the SEO data.
