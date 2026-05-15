# Section Reordering Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 메인 페이지와 소개 페이지의 섹션 순서를 관리자 페이지에서 드래그 앤 드롭으로 자유롭게 변경할 수 있는 동적 렌더링 시스템 구축.

**Architecture:** 
1. `SECTION_MAP` 레지스트리를 정의하여 문자열 키를 실제 React 컴포넌트에 매핑.
2. `Home.tsx`와 `About.tsx`를 리팩토링하여 DB에서 불러온 순서 배열에 따라 컴포넌트를 동적으로 렌더링.
3. `Content.tsx`(Visual Editor)에 HTML5 Drag & Drop API를 활용한 순서 관리 패널 추가.

**Tech Stack:** React, Lucide-react, Supabase, TailwindCSS

---

### Task 1: 컴포넌트 레지스트리 및 페이지 동적화 준비

**Files:**
- Create: `src/public/lib/registry.ts`
- Modify: `src/public/pages/Home.tsx`

- [ ] **Step 1: 컴포넌트 레지스트리 정의**
모든 페이지 섹션을 문자열 키로 호출할 수 있도록 매핑 파일을 만듭니다.

```typescript
// src/public/lib/registry.ts
import Hero from '../components/Hero';
import Background from '../components/Background';
import Composition from '../components/Composition';
import Effects from '../components/Effects';
import QuoteBanner from '../components/QuoteBanner';
import Reach from '../components/Reach';
import Guide from '../components/Guide';
import Support from '../components/Support';
import SupportEn from '../components/SupportEn';
import Schedule from '../components/Schedule';

export const HOME_SECTION_MAP: Record<string, any> = {
    hero: Hero,
    background: Background,
    composition: Composition,
    effects: Effects,
    quote: QuoteBanner,
    reach: Reach,
    guide: Guide,
    support: Support,
    support_en: SupportEn,
    schedule: Schedule
};

export const HOME_DEFAULT_LAYOUT = [
    "hero", "background", "composition", "effects", "quote", "reach", "guide", "support", "schedule"
];
```

- [ ] **Step 2: Home.tsx 리팩토링**
고정된 컴포넌트 호출을 동적 루프로 변경합니다.

```tsx
// src/public/pages/Home.tsx
import { HOME_SECTION_MAP, HOME_DEFAULT_LAYOUT } from '../lib/registry';
// ... 기존 imports 유지

const Home: React.FC = () => {
    const { getContent, lang } = useI18n();
    const layoutData = getContent('page_layout_home');
    const layout = Array.isArray(layoutData.styles?.order) ? layoutData.styles.order : HOME_DEFAULT_LAYOUT;

    return (
        <>
            <SEO slug="home" />
            <main>
                {layout.map((key: string) => {
                    const id = key === 'support' && lang === 'en' ? 'support_en' : key;
                    const Component = HOME_SECTION_MAP[id];
                    if (!Component) return null;

                    // Props 주입 처리 (기본 섹션들은 일관된 인터페이스를 따르도록 조정)
                    const props: any = {};
                    if (key === 'background') props.onOpenArticle = () => setIsArticleModalOpen(true);
                    if (key === 'composition') props.onOpenSample = () => setIsSampleModalOpen(true);
                    if (key === 'guide') props.onOpenLetter = () => setIsLetterModalOpen(true);

                    return <Component key={key} {...props} />;
                })}
            </main>
            {/* 모달은 고정 유지 */}
        </>
    );
};
```

- [ ] **Step 3: Commit**
```bash
git add src/public/lib/registry.ts src/public/pages/Home.tsx
git commit -m "feat(pages): implement dynamic section rendering for Home page"
```

---

### Task 2: 소개 페이지(About) 동적화 및 컴포넌트화

**Files:**
- Modify: `src/public/pages/About.tsx`
- Create: `src/public/components/AboutSections.tsx` (선택 사항: 인라인 섹션을 컴포넌트로 분리)

- [ ] **Step 1: About 페이지 인라인 섹션 컴포넌트화**
`About.tsx`에 길게 늘어져 있는 섹션들을 레지스트리에 등록할 수 있는 작은 컴포넌트들로 추출하거나, `About.tsx` 내부에 로컬 레지스트리를 만듭니다.

- [ ] **Step 2: About.tsx 동적 렌더링 적용**
Home과 동일한 방식으로 `page_layout_about` 키를 사용하도록 수정합니다.

- [ ] **Step 3: Commit**
```bash
git add src/public/pages/About.tsx
git commit -m "feat(pages): implement dynamic section rendering for About page"
```

---

### Task 3: Visual Editor에 순서 관리 UI(Drag & Drop) 추가

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: 사이드바에 "Page Structure" 탭 추가**
현재 "Property Editor" 외에 페이지의 전체 구조를 볼 수 있는 탭을 만듭니다.

- [ ] **Step 2: 드래그 앤 드롭 리스트 구현**
HTML5 API를 사용하여 섹션들의 순서를 바꾸는 리스트 컴포넌트를 작성합니다.

```tsx
const [layout, setLayout] = useState<string[]>([]);

const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('dragIndex', index.toString());
};

const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    const sourceIndex = parseInt(e.dataTransfer.getData('dragIndex'));
    const newLayout = [...layout];
    const [removed] = newLayout.splice(sourceIndex, 1);
    newLayout.splice(targetIndex, 0, removed);
    
    setLayout(newLayout);
    // 실시간 미리보기에 메시지 전송
    updateLayoutLive(newLayout);
};
```

- [ ] **Step 3: 데이터 저장 연동**
`handleSave` 시 `page_layout_home` (또는 about) 키의 `style_props.order`에 새로운 배열을 저장하도록 업데이트합니다.

- [ ] **Step 4: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "feat(editor): add drag-and-drop section reordering panel"
```

---

### Task 4: 최종 테스트 및 최적화

- [ ] **Step 1: 메인 페이지 섹션 순서 변경 테스트**
- [ ] **Step 2: 소개 페이지 섹션 순서 변경 테스트**
- [ ] **Step 3: 순서 변경 후 실제 사이트 반영 확인**
- [ ] **Step 4: 빌드 및 최종 배포**

```bash
npm run build
git push origin main
```
