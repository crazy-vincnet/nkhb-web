# About Us 페이지 가독성 및 모바일 최적화 디자인 사양서

## 1. 개요
- **목적:** `about.html` 페이지의 텍스트 가독성을 높이고 모바일 환경에서의 레이아웃과 사용자 경험을 최적화합니다.
- **대상 파일:** `style.css` (About Page Styles 섹션)

## 2. 디자인 전략 (종합 디자인 폴리싱)
- **타이포그래피 최적화:** `clamp()` 함수를 사용하여 화면 크기에 따라 텍스트 크기가 자연스럽게 변경되도록 하고, `line-height`를 조정하여 긴 텍스트의 가독성을 개선합니다.
- **여백 및 구조 개선:** 모바일 화면에서 불필요한 공백을 줄이고 콘텐츠의 밀도를 높여 스크롤 경험을 개선합니다.
- **시각적 완성도:** 카드 컴포넌트(`mission-item`, `ministry-card`)의 그림자와 테두리를 다듬어 세련된 느낌을 강조합니다.

## 3. 상세 수정 사항 (`style.css`)

### 3.1 Hero Section
- **데스크톱:** `h1` 폰트 크기를 `clamp(2rem, 5vw, 3.5rem)`으로 변경하여 유동성 부여. `subtitle` 크기도 유동적으로 조정.
- **모바일 (`@media (max-width: 768px)`):** 기존 `font-size: 2rem` 유지, 패딩을 줄여(`padding: 100px 0 60px;`) 첫 화면의 답답함 해소.

### 3.2 Intro & Values Section (가독성 향상)
- `.about-intro .text-content p`: `line-height: 1.8; margin-bottom: 20px; font-size: 1.05rem;` 추가.
- `.vision-box`: 패딩을 상하/좌우 유동적으로 변경(`padding: clamp(30px, 5vw, 50px);`). 텍스트 크기를 키우고(`font-size: 1.1rem;`) 라인 하이트(`1.8`) 조정.
- `.mission-desc`: `font-size: 1.05rem; line-height: 1.7;`

### 3.3 Cards (Mission & Ministry)
- **`.mission-item`:** 
  - `border-radius: 12px;` 로 둥글게 변경.
  - `box-shadow: 0 4px 10px rgba(0,0,0,0.03);` 및 `border: 1px solid rgba(0,0,0,0.05);` 로 입체감 부여.
  - `line-height: 1.6;` 추가.
  - **모바일:** `grid-template-columns: 1fr;`로 1열 배치 보장, `gap: 15px;`로 간격 조정.
- **`.ministry-card`:**
  - `box-shadow: 0 8px 25px rgba(0,0,0,0.06);` (그림자 부드럽게 강화).
  - `padding: clamp(25px, 4vw, 40px);` 로 모바일 여백 최적화.

### 3.4 Founder Section (모바일 최적화)
- **`.founder-grid`:** 모바일(`max-width: 768px`)에서 `gap: 30px;`로 이미지와 텍스트 간격 축소.
- **`.founder-image img`:** 모바일에서 사진이 너무 커 보이지 않도록 `max-width: 100%;` 확인 및 경우에 따라 `margin: 0 auto; display: block;` 처리로 중앙 정렬.
- **`.profile-list li`:** `line-height: 1.7; font-size: 1.05rem; margin-bottom: 12px;` 가독성 개선 및 간격 확보.
- **`.profile-list li::before`:** 불렛 포인트 위치 미세 조정 (`top: 2px;` 등).

### 3.5 CTA Section
- **`.cta-buttons .btn-fill-accent`, `.cta-buttons .btn-outline-dark`:** 모바일에서 이미 100% 처리되어 있으나, 버튼 내 패딩을 `padding: 16px 20px;` 정도로 약간 줄여 화면에 꽉 차도 부담스럽지 않게 조정.

## 4. 검토 사항
- 모든 기기(데스크톱, 태블릿, 모바일)에서 텍스트가 잘리는 현상이 없는지 확인.
- 줄 간격 증가로 인해 페이지가 너무 길어 보이지 않는지 균형 검토.
- 모바일에서 버튼 클릭 영역이 충분히 확보되었는지 확인.
