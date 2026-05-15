# Automatic Asset Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 이미지 업로드 시 브라우저 단에서 자동으로 리사이징 및 WebP 압축을 수행하여 사이트 성능을 극대화함.

**Architecture:** 
1. `imageOptimizer.ts` 유틸리티를 생성하여 Canvas API 기반의 이미지 처리 로직 구현.
2. `Content.tsx`의 업로드 핸들러를 수정하여 원본 파일 대신 최적화된 Blob을 서버에 전송.
3. 업로드 UI에 최적화 진행 상태(Optimizing...)를 표시하여 사용자 피드백 강화.

**Tech Stack:** React, Canvas API, Supabase Storage

---

### Task 1: 이미지 최적화 유틸리티 구현

**Files:**
- Create: `src/admin/lib/imageOptimizer.ts`

- [ ] **Step 1: 최적화 함수 작성**
Canvas API를 사용하여 이미지를 리사이징하고 WebP로 변환하는 함수를 만듭니다.

```typescript
// src/admin/lib/imageOptimizer.ts
export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'image/webp' | 'image/jpeg';
}

export const optimizeImage = async (file: File, options: OptimizeOptions = {}): Promise<Blob> => {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8, format = 'image/webp' } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize logic
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas to Blob conversion failed'));
        }, format, quality);
      };
    };
    reader.onerror = (error) => reject(error);
  });
};
```

- [ ] **Step 2: Commit**
```bash
git add src/admin/lib/imageOptimizer.ts
git commit -m "feat(admin): implement client-side image optimization utility"
```

---

### Task 2: Content.tsx 업로드 로직 통합

**Files:**
- Modify: `src/admin/pages/Content.tsx`

- [ ] **Step 1: 업로드 핸들러 수정**
`handleLanguageFileUpload` 함수에 최적화 단계를 추가합니다.

```typescript
// src/admin/pages/Content.tsx 상단에 임포트
import { optimizeImage } from '../lib/imageOptimizer';

// handleLanguageFileUpload 수정
setUploading(true);
try {
    // 1. 이미지 최적화 수행 (WebP 변환)
    const optimizedBlob = await optimizeImage(file);
    
    // 2. 파일 확장자를 webp로 고정
    const fileName = `${selectedKey}-${field}-${Math.random().toString(36).substring(2)}.webp`;
    const filePath = `site-assets/${fileName}`;

    // 3. optimizedBlob을 Supabase에 업로드
    const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, optimizedBlob, { contentType: 'image/webp' });
    
    // ... 이후 URL 가져오기 및 상태 업데이트 로직 동일
}
```

- [ ] **Step 2: UI 피드백 강화**
업로드 버튼의 텍스트를 `uploading` 상태에 따라 "OPTIMIZING..." 또는 "UPLOADING..."으로 세분화합니다. (선택 사항)

- [ ] **Step 3: Commit**
```bash
git add src/admin/pages/Content.tsx
git commit -m "feat(editor): integrate automatic image optimization into upload flow"
```

---

### Task 3: 최종 검증 및 최적화 효과 확인

- [ ] **Step 1: 대용량 PNG 업로드 테스트** (WebP로 자동 변환 및 용량 감소 확인)
- [ ] **Step 2: 고해상도 이미지 리사이징 테스트** (가로 폭 1920px 제한 확인)
- [ ] **Step 3: 빌드 및 최종 배포**

```bash
npm run build
git push origin main
```
