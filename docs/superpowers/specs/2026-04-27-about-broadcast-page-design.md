# 디자인 문서: 대북방송의 역할 상세 페이지 추가

- **작성일:** 2026-04-27
- **상태:** 승인됨
- **관련 섹션:** 방송 배경 (`#background`), 신규 페이지 (`about-broadcast.html`)

## 1. 개요
사용자가 대북방송의 본질적인 가치와 역할을 깊이 있게 이해할 수 있도록, 상세 서술형 콘텐츠를 담은 전용 아티클 페이지를 추가하고 메인 페이지에서 자연스럽게 연결합니다.

## 2. 디자인 전략
- **연결성:** 메인 페이지 '방송 배경' 섹션 하단에 흐름을 깨지 않는 버튼을 배치하여 이동을 유도합니다.
- **몰입감:** 신규 페이지는 '독서'에 최적화된 아티클 레이아웃을 채택합니다.
- **일관성:** 기존 웹사이트의 폰트(Pretendard), 컬러 시스템, 헤더/푸터 구조를 그대로 계승합니다.

## 3. 상세 설계

### 3.1 메인 페이지 (`index.html`) 수정
- **위치:** `section.background` 내부의 `sub-desc` 문단 아래.
- **추가 요소:** 
  ```html
  <div class="action-area" style="margin-top: 40px;">
      <a href="about-broadcast.html" class="btn-hero btn-outline" style="color: var(--accent-color); border-color: var(--accent-color);">대북방송의 역할 자세히 읽기 →</a>
  </div>
  ```

### 3.2 신규 페이지 (`about-broadcast.html`) 구조
- **Hero 섹션:** 제목 "통일을 준비하는 가장 조용하지만 강력한 힘, 대북방송"을 강조.
- **Body 섹션:** 
    - Max-width: 750px (중앙 정렬).
    - 폰트 크기: 18px / 줄 간격: 1.8.
    - 문단 간격: 40px.
    - 중간 강조 인용구(Blockquote) 적용.

### 3.3 CSS 확장 (`style.css`)
- **아티클 전용 클래스:**
    - `.article-container`: 본문 너비 제한 및 패딩.
    - `.article-title`: 아티클 페이지 전용 헤드라인 스타일.
    - `.article-content p`: 문단 스타일링.
    - `.article-quote`: 핵심 문장 강조 스타일.

## 4. 기대 효과
- 단순 정보 나열을 넘어 대북방송의 철학적, 전략적 가치를 전달하여 브랜드 신뢰도 상승.
- 체류 시간 증대 및 사역에 대한 깊은 공감 유도.
