# NKHB Web (뉴코리아 희망방송)

이 문서는 프로젝트의 아키텍처, 컨벤션, 그리고 주요 워크플로우를 정의합니다. 모든 개발팀원과 AI 어시스턴트는 이 가이드를 최우선으로 준수해야 합니다.

## 🚀 프로젝트 개요
NKHB(New Korea Hope Broadcasting)는 라디오 전파를 통해 북한 주민들에게 희망, 진실, 복음을 전하는 대북 라디오 방송의 공식 웹사이트입니다.

## 🛠 기술 스택
- **Frontend:** React (v18.2), TypeScript, Vite
- **Styling:** TailwindCSS, PostCSS
- **Backend/Database:** Supabase (PostgreSQL, Auth, RLS)
- **Routing:** React Router DOM (v6)
- **Internationalization:** Custom Context-based I18n (Static + Dynamic)
- **Editors:** TipTap (Post/Content), GrapesJS (Dynamic Pages)

## 🏗 아키텍처 & 주요 컨벤션

### 1. Multi-entry 빌드 구조
Vite 설정을 통해 퍼블릭 사이트와 관리자 페이지를 독립적인 엔트리로 관리합니다.
- **Vite Config:** `vite.config.ts`에서 `rollupOptions.input`을 통해 `main`과 `admin` 분리.
- **Public Site:** `index.html` -> `src/public/main.tsx`
- **Admin Panel:** `admin/index.html` -> `src/admin/main.tsx` (Basename: `/admin`)

### 2. 디렉토리 구조
```text
/
├── admin/            # 관리자 페이지 HTML 엔트리
├── src/
│   ├── public/       # 일반 사용자용 소스 코드
│   │   ├── components/
│   │   ├── lib/      # i18n.tsx, supabase.ts 등
│   │   ├── pages/    # Home, About, DynamicPage 등
│   │   └── App.tsx
│   └── admin/        # 관리자용 소스 코드
│       ├── components/
│       ├── lib/      # supabase.ts (Admin 전용)
│       ├── pages/    # Letters, Audio, Schedule, Pages, Posts 등
│       └── App.tsx
├── supabase/         # 마이그레이션 및 스키마 정의
└── public/           # 정적 자산 (이미지, 오디오 등)
```

### 3. 데이터베이스 & 보안 (Supabase)
모든 테이블은 RLS(Row Level Security)가 활성화되어 있습니다.
- **주요 테이블:**
    - `letters`: "희망의 편지" 접수 데이터
    - `audio_tracks`: "샘플 듣기" 기능용 오디오 정보
    - `schedule`: 방송 시간 및 주파수 정보
    - `content`: 동적 다국어 번역 데이터
    - `posts` / `bulletin_boards`: 게시판 및 블로그 콘텐츠
    - `dynamic_pages`: GrapesJS로 생성된 동적 페이지
- **보안 정책:**
    - `public`: `letters` (INSERT 전용), 기타 테이블 (SELECT 전용)
    - `authenticated` (Admin): 모든 테이블에 대해 Full CRUD 권한

### 4. Internationalization (I18n)
`src/public/lib/i18n.tsx`에서 제공하는 `I18nProvider`를 사용합니다.
- **지원 언어:** `ko` (기본값), `en`
- **작동 방식:** `staticTranslations` 객체(로컬)와 Supabase `content` 테이블(동적) 데이터를 병합하여 사용.
- **사용법:** `const { t } = useI18n();` -> `t('translation_key')`

## 📝 개발 가이드라인
- **Surgical Updates:** 코드 수정 시 기존 스타일과 구조를 최대한 유지하며 필요한 부분만 정밀하게 수정합니다.
- **Type Safety:** 모든 Props와 State에 TypeScript 인터페이스를 정의합니다.
- **Tailwind CSS:** 인라인 스타일보다는 Tailwind 유틸리티 클래스 사용을 지향하며, 복잡한 경우 `index.css`에 추상화합니다.
- **Testing:** 새로운 기능 추가 시 관련 테스트 코드를 작성하거나, 수동 검증 절차를 문서화합니다.
- **Deployment:** Vercel/Netlify 등 SPA 환경 배포 시 `/admin` 경로에 대한 Fallback 설정이 필요할 수 있습니다.

## 🔧 주요 명령어서
- **개발 서버 실행:** `npm run dev`
- **프로젝트 빌드:** `npm run build` (tsc 포함)
- **린트 체크:** `npm run lint`
