# About Us 페이지 디자인 통일 및 메뉴 추가 디자인 사양서

## 1. 개요
- **목적:** `about.html` 페이지의 헤더(메뉴)와 푸터 디자인을 `index.html`과 완전히 일관되게 통일하고, 메뉴에 "소개 / About Us" 항목을 추가하여 접근성을 높임.
- **대상 파일:** `about.html`, `index.html`, `script.js`

## 2. 변경 사항

### 2.1 메뉴(Header) 업데이트
- **메뉴 항목 추가:** 
  - 한국어: "소개"
  - 영어: "About Us"
- **대상 위치:** `index.html` 및 `about.html`의 네비게이션 바.
- **링크:** `about.html`로 연결.
- **디자인:** `index.html`의 기존 헤더 구조(`nav`, `logo`, `nav-container`, `mobile-menu-btn`)를 `about.html`에도 동일하게 적용.

### 2.2 푸터(Footer) 업데이트
- **디자인 통일:** `index.html`의 상세 푸터 구조(`.footer`, `.footer-content`, `.footer-logo`, `.footer-info`, `.footer-bottom`)를 `about.html`에도 동일하게 적용.

### 2.3 다국어(i18n) 연동
- **신규 키 추가:** `nav_about` 키를 `script.js`의 `translations` 객체에 추가.
  - `en`: "About Us"
  - `ko`: "소개"

## 3. 기술적 구현 계획

### Step 1: `script.js` 수정
- `translations.en` 및 `translations.ko`의 `Navigation` 섹션에 `nav_about` 추가.

### Step 2: `index.html` 및 `about.html` 헤더 수정
- `<ul class="nav-links">` 내부에 `nav_about` 키를 가진 리스트 아이템 추가.
- `about.html`의 헤더를 `index.html`과 동일한 마크업 구조로 교체.

### Step 3: `about.html` 푸터 수정
- `about.html`의 단순한 푸터를 `index.html`의 상세 푸터 마크업으로 교체.

## 4. 검토 사항
- 모바일 메뉴 버튼이 `about.html`에서도 정상 작동하는지 확인.
- 언어 전환 시 메뉴 항목이 올바르게 번역되는지 확인.
- 링크 클릭 시 페이지 이동이 원활한지 확인.
