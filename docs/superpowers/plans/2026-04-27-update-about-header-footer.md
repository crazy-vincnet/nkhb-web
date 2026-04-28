# About Us 페이지 디자인 통일 및 메뉴 추가 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `about.html`의 헤더와 푸터를 `index.html`과 똑같이 만들고, 메뉴에 "소개 / About Us" 항목을 추가합니다.

**Architecture:** `script.js`에 다국어 키를 추가하고, `index.html`과 `about.html`의 공통 UI 요소를 동기화합니다.

**Tech Stack:** HTML5, Vanilla JS (i18n).

---

### Task 1: 다국어 번역 데이터 업데이트

**Files:**
- Modify: `script.js`

- [ ] **Step 1: `script.js`의 `translations` 객체에 `nav_about` 키 추가**

```javascript
// translations.en.nav 섹션에 추가
nav_about: "About Us",

// translations.ko.nav 섹션에 추가
nav_about: "소개",
```

- [ ] **Step 2: 커밋**

```bash
git add script.js
git commit -m "feat: add nav_about translation key"
```

---

### Task 2: 메인 페이지 메뉴 업데이트

**Files:**
- Modify: `index.html`

- [ ] **Step 1: `index.html`의 네비게이션 바에 "소개" 링크 추가**

```html
<!-- index.html의 <ul class="nav-links"> 내부에 추가 -->
<li><a href="about.html" data-i18n-key="nav_about">소개</a></li>
```

- [ ] **Step 2: 커밋**

```bash
git add index.html
git commit -m "feat: add About Us link to index.html navigation"
```

---

### Task 3: 소개 페이지 디자인 동기화 (Header & Footer)

**Files:**
- Modify: `about.html`

- [ ] **Step 1: `about.html`의 헤더를 `index.html`과 동일하게 수정 (메뉴 항목 포함)**

```html
<header>
    <nav>
        <div class="logo">
            <a href="/">
                <img src="https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png" alt="NKHB 로고">
            </a>
        </div>
        
        <div class="nav-container">
            <ul class="nav-links">
                <li><a href="/#background" data-i18n-key="nav_background">방송배경</a></li>
                <li><a href="/#composition" data-i18n-key="nav_composition">방송구성</a></li>
                <li><a href="/#effects" data-i18n-key="nav_effects">기대효과</a></li>
                <li><a href="/#guide" data-i18n-key="nav_guide">참여 안내</a></li>
                <li><a href="/#support" data-i18n-key="nav_support">후원하기</a></li>
                <li><a href="/#schedule" data-i18n-key="nav_schedule">방송 시간 및 주파수</a></li>
                <li><a href="about.html" data-i18n-key="nav_about">소개</a></li>
            </ul>

            <div class="lang-selector">
                <a href="#" class="active" data-lang="ko">한국어</a>
                <div class="lang-divider"></div>
                <a href="#" data-lang="en">EN</a>
            </div>
        </div>

        <button class="mobile-menu-btn" aria-label="메뉴 열기">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>
</header>
```

- [ ] **Step 2: `about.html`의 푸터를 `index.html`과 동일하게 수정**

```html
    <!-- Footer Section -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png" alt="NKHB 로고">
                </div>
                <div class="footer-info">
                    <p data-i18n-key="footer_contact">뉴코리아 희망방송 (NKHB) | 연락처: nkhb316@gmail.com</p>
                    <p data-i18n-key="footer_schedule">월·수·금 02:30 (5920 kHz) / 화·목·토 23:00 (9470 kHz)</p>
                </div>
                <div class="footer-bottom">
                    <p data-i18n-key="footer_copyright">&copy; 2026 뉴코리아 희망방송. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
```

- [ ] **Step 3: 커밋**

```bash
git add about.html
git commit -m "style: sync about.html header and footer with index.html"
```
