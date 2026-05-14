# Content Center Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 수많은 번역 키를 효율적으로 관리하기 위해 섹션 내 요소 그룹화, 전용 링크 편집 필드, 전역 검색, 하단 플로팅 저장 바를 포함한 UI/UX 개편

**Architecture:** 
1. `SECTIONS` 및 `GROUP_CONFIG` 상수를 정의하여 키 명칭 규칙(`hero_`, `hero_btn_` 등)에 따라 자동 그룹화. 
2. `modifiedIds` 상태를 통해 변경된 항목만 추적하여 하단 플로팅 바 활성화. 
3. `specializedInputs` 컴포넌트를 분리하여 텍스트/링크/이미지 타입별 최적화된 UI 제공.

**Tech Stack:** React, TailwindCSS, Lucide-react, Supabase

---

### Task 1: 상수 및 기본 구조 정의

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: 섹션 및 그룹화 설정 상수 업데이트**
섹션 정보를 보강하고, 각 섹션 내에서 요소들을 어떻게 그룹화할지 결정하는 패턴을 정의합니다.

```typescript
// src/admin/pages/Content.tsx 상단에 정의
const SECTIONS = [
  { id: 'hero', label: '히어로', description: '메인 배너 제목, 설명, 버튼, 통계' },
  { id: 'about', label: '소개', description: '기관 소개 및 미션 섹션' },
  { id: 'ministry', label: '사역', description: '진행 중인 사역 리스트' },
  { id: 'support', label: '후원', description: '후원 안내 및 계좌 정보' },
  { id: 'nav', label: '공통/메뉴', description: '내비게이션, 푸터, 로고' },
  { id: 'seo', label: 'SEO', description: '검색 엔진 최적화 메타 정보' },
];

const GROUP_CONFIG: { [sectionId: string]: { label: string; pattern: string }[] } = {
  hero: [
    { label: '메인 문구', pattern: 'hero_title' },
    { label: '설명 및 슬로건', pattern: 'hero_desc' },
    { label: '메인 버튼', pattern: 'hero_button' },
    { label: '히어로 이미지', pattern: 'image_hero' },
  ],
  support: [
    { label: '후원 안내', pattern: 'support_title' },
    { label: '계좌 정보', pattern: 'support_bank' },
  ],
  // ... 기타 섹션 설정 (nav, about, ministry, seo 등)
};
```

- [ ] **Step 2: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "refactor(admin): define section and group configurations for content center"
```

---

### Task 2: 그룹화 로직 및 필터링 구현

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: `useMemo`를 이용한 계층적 데이터 가공**
현재 선택된 탭과 검색어에 따라 데이터를 그룹화된 형태로 변환하는 로직을 작성합니다.

```typescript
// Content 컴포넌트 내부
const groupedItems = useMemo(() => {
  const groups = GROUP_CONFIG[activeTab] || [{ label: '일반', pattern: '' }];
  
  return groups.map(group => {
    const items = content.filter(item => {
      const matchesSection = item.key.startsWith(activeTab) || item.key.includes(activeTab);
      const matchesGroup = group.pattern === '' || item.key.includes(group.pattern);
      const matchesSearch = searchQuery === '' || 
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.value_ko?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.value_en?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSection && matchesGroup && matchesSearch;
    });
    return { ...group, items };
  }).filter(g => g.items.length > 0);
}, [content, activeTab, searchQuery]);
```

- [ ] **Step 2: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "feat(admin): implement hierarchical grouping logic for content items"
```

---

### Task 3: 특화 필드 컴포넌트 구현 (링크 & 텍스트)

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: `ContentField` 컴포넌트 작성**
키의 이름에 따라 일반 텍스트, 링크, 이미지 필드를 구분하여 렌더링합니다.

```typescript
const ContentField = ({ item, lang, onChange }: any) => {
  const isLink = item.key.includes('url') || item.key.includes('link');
  const value = lang === 'ko' ? item.value_ko : item.value_en;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase">
        {isLink ? <Globe size={10} /> : <FileText size={10} />}
        {lang === 'ko' ? 'Korean' : 'English'}
      </div>
      <div className="relative group">
        {isLink ? (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(item.id, e.target.value)}
            className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            placeholder="https://... 또는 /path"
          />
        ) : (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(item.id, e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[80px] resize-none"
            placeholder="내용을 입력하세요..."
          />
        )}
      </div>
    </div>
  );
};
```

- [ ] **Step 2: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "feat(admin): add specialized content fields for links and text"
```

---

### Task 4: 레이아웃 및 플로팅 저장 바 구현

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: 메인 렌더링 루프 수정 (카드 방식)**
그룹화된 데이터를 카드(Accordion) 형태로 렌더링하고 검색바를 추가합니다.

```typescript
// UI 렌더링 부분
<div className="space-y-8">
  {groupedItems.map((group, idx) => (
    <div key={idx} className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm">
      <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{group.label}</h3>
        <span className="text-xs text-gray-400 font-bold">{group.items.length} items</span>
      </div>
      <div className="p-8 space-y-10">
        {group.items.map(item => (
          <div key={item.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContentField item={item} lang="ko" onChange={handleChange} />
            <ContentField item={item} lang="en" onChange={handleChange} />
          </div>
        ))}
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 2: 플로팅 저장 바 추가**
수정 사항이 있을 때만 하단에 나타나는 바를 구현합니다.

```typescript
{modifiedIds.size > 0 && (
  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-8 z-50 animate-in fade-in slide-in-from-bottom-4">
    <span className="text-sm font-bold">{modifiedIds.size}개의 변경사항이 있습니다.</span>
    <div className="flex gap-2">
      <button onClick={revertAll} className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">취소</button>
      <button onClick={handleBatchUpdate} className="px-6 py-2 bg-blue-600 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all">저장하기</button>
    </div>
  </div>
)}
```

- [ ] **Step 3: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "feat(admin): implement grouped card layout and floating save bar"
```
