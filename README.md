# NKHB Web Deployment Guide

이 문서는 NKHB 웹사이트를 배포하기 위한 안내서입니다.

## 🛠 배포 전 준비 사항

### 1. 환경 변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 다음 값을 설정해야 합니다. (기존 `.env` 파일이 있다면 확인해 주세요.)

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Supabase 설정
데이터베이스 스키마가 로컬 마이그레이션 파일(`supabase/migrations/20260506_init.sql`)과 일치하는지 확인하십시오.
- `audio_tracks` 테이블에 실제 오디오 URL이 등록되어 있어야 "샘플 듣기" 기능이 작동합니다.
- 관리자 로그인을 위해 Supabase Auth에서 관리자 계정을 생성해야 합니다.

## 📦 빌드 및 배포

### 로컬 빌드 테스트
배포 전 로컬에서 빌드가 정상적으로 완료되는지 확인합니다.
```bash
npm install
npm run build
```
빌드 결과물은 `dist/` 디렉토리에 생성됩니다.

### 플랫폼별 배포 안내

#### Vercel / Netlify
1. 프로젝트를 GitHub 리포지토리에 푸시합니다.
2. Vercel 또는 Netlify에서 리포지토리를 연결합니다.
3. 빌드 설정을 다음과 같이 입력합니다:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. **Environment Variables** 메뉴에서 `VITE_SUPABASE_URL`과 `VITE_SUPABASE_ANON_KEY`를 설정합니다.

#### Static Hosting (S3, Cloudflare Pages 등)
`dist/` 디렉토리의 파일들을 정적 호스팅 서비스에 업로드하면 됩니다.
- **주의:** 이 프로젝트는 Multi-entry 구조이므로 `/admin` 경로로 직접 접속 시 404가 발생하지 않도록 서버 설정을 확인해야 할 수도 있습니다. (SPA Fallback 설정 필요)

## 🔧 주요 경로
- **Main Site:** `/` (사용자 페이지)
- **Admin Panel:** `/admin` (관리자 로그인 및 데이터 관리)

---
추가 문의사항은 `GEMINI.md`를 참조하거나 개발팀에 문의해 주세요.
