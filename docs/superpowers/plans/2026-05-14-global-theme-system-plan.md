# Global Theme System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사이트 전체의 색상, 폰트, 간격, 모양을 한 번에 제어할 수 있는 글로벌 테마 시스템 구축 및 실시간 편집 환경 제공.

**Architecture:** 
1. `I18nProvider`가 DB에서 `global_theme_settings` 키를 로드하여 `:root` CSS 변수를 동적으로 덮어씀.
2. `Content.tsx`에 "THEME" 탭을 추가하고 `postMessage`를 통해 실시간 테마 변경 사항을 미리보기 화면에 전달.
3. `style.css`에서 하드코딩된 값들을 변수로 치환하여 테마 엔진의 통제력을 강화.

**Tech Stack:** React, TailwindCSS, CSS Variables, Supabase

---

### Task 1: 테마 엔진 고도화 및 변수 주입 로직

**Files:**
- Modify: `src/public/lib/i18n.tsx`

- [ ] **Step 1: 테마 변수 주입 로직 추가**
`I18nProvider` 내부에 테마 설정을 감시하고 실제 DOM의 `:root`에 CSS 변수를 주입하는 코드를 작성합니다.

```typescript
// src/public/lib/i18n.tsx 내부
const applyTheme = (theme: any) => {
  const root = document.documentElement;
  if (!theme) return;
  
  const mapping: Record<string, string> = {
    '--accent-color': theme.colors?.accent,
    '--accent-light': theme.colors?.accentLight,
    '--primary-color': theme.colors?.primary,
    '--section-padding': theme.ui?.sectionPadding,
    '--border-radius-lg': theme.ui?.borderRadius,
    '--text-main': theme.colors?.textMain
  };

  Object.entries(mapping).forEach(([key, value]) => {
    if (value) root.style.setProperty(key, value);
  });
};

// useEffect 내부에서 fetch 완료 후 및 liveChanges 변경 시 호출
```

- [ ] **Step 2: 실시간 테마 메시지 리스너 추가**
`NKHB_LIVE_THEME_UPDATE` 메시지를 수신하여 상태를 즉시 반영하도록 합니다.

- [ ] **Step 3: Commit**
```bash
git add src/public/lib/i18n.tsx
git commit -m "feat(i18n): implement dynamic CSS variable injection for global theme system"
```

---

### Task 2: Admin UI - THEME 편집 탭 구현

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: 탭 메뉴 확장 및 UI 구성**
"PROPERTIES", "STRUCTURE" 옆에 "THEME" 탭을 추가하고, 테마 전용 컨트롤러들을 배치합니다.

- [ ] **Step 2: 테마 컨트롤러 컴포넌트 작성**
색상 선택기, 슬라이더(여백, 둥글기용)를 포함한 세련된 입력폼을 구현합니다.

- [ ] **Step 3: 실시간 동기화 브릿지 연결**
값이 바뀔 때마다 `iframe.contentWindow.postMessage`로 테마 데이터를 전송합니다.

- [ ] **Step 4: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "feat(admin): add THEME tab to Visual Editor with real-time design controls"
```

---

### Task 3: style.css 표준화 및 변수 연결

**Files:**
- Modify: `src/public/style.css`

- [ ] **Step 1: 하드코딩된 값 전수 조사 및 변수 치환**
특히 버튼(`btn-hero`), 섹션(`section`), 카드(`card`) 스타일에서 하드코딩된 색상과 패딩을 CSS 변수(`var(--...)`)로 교체합니다.

- [ ] **Step 2: 기본 테마 데이터 삽입 (Migration/Seed)**
`global_theme_settings` 키가 없을 경우를 대비해 초기 기본값을 설정합니다.

- [ ] **Step 3: Commit**
```bash
git add src/public/style.css
git commit -m "style: standardize CSS variables and remove hardcoded design values"
```

---

### Task 4: 최종 통합 테스트 및 검증

- [ ] **Step 1: 테마 변경 시 사이트 전체 일관성 확인**
- [ ] **Step 2: 모바일 미리보기에서의 디자인 적합성 확인**
- [ ] **Step 3: 빌드 및 배포**

```bash
npm run build
git push origin main
```
