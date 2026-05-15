# Editor History (Undo/Redo) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 관리자 에디터에서 작업 중 실수 방지 및 자유로운 실험을 위해 스마트한 Undo/Redo 히스토리 시스템 구축.

**Architecture:** 
1. `useHistory` 커스텀 훅을 통해 `undoStack`과 `redoStack` 관리.
2. 입력 완료(`onBlur`) 및 드래그 종료 시점에만 상태를 캡처하는 스마트 로직 적용.
3. 에디터 상단 바 UI와 단축키(Ctrl+Z) 연동.

**Tech Stack:** React, Lucide-react

---

### Task 1: useHistory 커스텀 훅 구현

**Files:**
- Create: `src/admin/lib/useHistory.ts`

- [ ] **Step 1: 히스토리 관리 훅 작성**
상태 배열을 관리하고 Undo/Redo 로직을 캡슐화한 훅을 만듭니다.

```typescript
// src/admin/lib/useHistory.ts
import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<T[]>([initialState]);

  const push = useCallback((state: T) => {
    setHistory(prev => {
      const next = prev.slice(0, index + 1);
      if (JSON.stringify(next[next.length - 1]) === JSON.stringify(state)) return prev;
      return [...next, state].slice(-50); // 최대 50단계
    });
    setIndex(prev => Math.min(prev + 1, 49));
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) setIndex(prev => prev - 1);
    return history[index - 1];
  }, [index, history]);

  const redo = useCallback(() => {
    if (index < history.length - 1) setIndex(prev => prev + 1);
    return history[index + 1];
  }, [index, history]);

  return { 
    state: history[index], 
    push, 
    undo, 
    redo, 
    canUndo: index > 0, 
    canRedo: index < history.length - 1 
  };
}
```

- [ ] **Step 2: Commit**
```bash
git add src/admin/lib/useHistory.ts
git commit -m "feat(admin): implement useHistory hook for editor state management"
```

---

### Task 2: Content.tsx 통합 및 스마트 캡처 로직

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: 히스토리 훅 연결**
`items`와 `themeSettings`를 통합한 상태 객체를 히스토리 훅에 연결합니다.

- [ ] **Step 2: 스마트 캡처(onBlur) 적용**
텍스트 필드와 링크 필드에 `onBlur` 핸들러를 추가하여, 입력이 끝나는 시점에만 `push`를 호출합니다.

```tsx
// 예시
<textarea 
    onBlur={() => pushHistory({ items, themeSettings })}
    // ... 기존 props
/>
```

- [ ] **Step 3: 드래그 앤 드롭 및 테마 변경 연동**
순서 변경이 끝나거나 테마 슬라이더 조작이 끝날 때 히스토리에 기록합니다.

- [ ] **Step 4: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "feat(admin): integrate history system with smart state capture logic"
```

---

### Task 3: UI 컨트롤 및 단축키 구현

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: 상단 바 Undo/Redo 버튼 추가**
`RotateCcw`, `RotateCw` 아이콘을 사용하여 클릭 시 `undo()`, `redo()`가 동작하게 합니다.

- [ ] **Step 2: 전역 단축키 리스너 추가**
`useEffect`를 사용하여 `keydown` 이벤트를 감지하고 `Ctrl+Z` 등을 처리합니다.

```typescript
useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
            if (e.shiftKey) redo();
            else undo();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
}, [undo, redo]);
```

- [ ] **Step 3: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "feat(admin): add history UI controls and keyboard shortcuts"
```

---

### Task 4: 최종 테스트 및 고도화

- [ ] **Step 1: 텍스트 수정 후 되돌리기 테스트**
- [ ] **Step 2: 섹션 순서 변경 후 되돌리기 테스트**
- [ ] **Step 3: 단축키(Cmd+Z) 작동 여부 확인**
- [ ] **Step 4: 빌드 및 배포**
