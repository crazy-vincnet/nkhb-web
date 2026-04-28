# NKFI About Us 페이지 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** NKFI(뉴코리아 파운데이션 인터내셔널)와 설립자 케네스 배 선교사를 소개하는 새로운 `about.html` 페이지를 생성하고 메인 페이지와 연결합니다.

**Architecture:** 기존 `index.html`의 스타일 시스템과 다국어(`script.js`) 연동 방식을 그대로 따르는 독립된 HTML 파일을 생성합니다. 가독성을 위해 그리드 레이아웃과 카드 컴포넌트를 활용합니다.

**Tech Stack:** HTML5, Vanilla CSS, Vanilla JS (i18n 연동).

---

### Task 1: 다국어 번역 데이터 업데이트

**Files:**
- Modify: `script.js`

- [ ] **Step 1: `script.js`의 `translations` 객체에 NKFI 소개 데이터 추가**

```javascript
// translations.en에 추가
about_hero_title: "NKFI (New Korea Foundation International)",
about_hero_subtitle: "Toward Restoration, Freedom, and Dignity for North Koreans",
about_intro_title: "About NKFI",
about_intro_p1: "New Korea Foundation International (NKFI) is an international NGO started in the US in 2016 by missionary Kenneth Bae, who was detained in North Korea for two years, to help forgotten and marginalized North Korean refugees around the world and prepare for a unified Korea.",
about_intro_p2: "NKFI prepares for the spiritual reconstruction of North Korea in anticipation of the upcoming unification of the South and North, activating the evangelization of a unified New Korea through mobilization, networking, training, and relief.",
about_intro_info1: "* Integrated from predecessor organizations Nehemiah Global Initiative (NGI) and NKRelief",
about_intro_info2: "* US-based 501(c)(3) non-profit organization (NGO) based in Minneapolis, MN and Seoul, Korea",
about_intro_info3: "* Member of KAICAM (Korea Association of Independent Churches and Missions)",
about_vision_title: "Vision Statement",
about_vision_desc: "To restore the recovery, freedom, and dignity of North Korean residents, and to achieve the unification of the Korean Peninsula where equality and freedom are guaranteed for all in Christ. NKFI takes the lead in the unification of South and North Korea and the spiritual reconstruction of North Korea through the power of the Gospel and the Holy Spirit.",
about_mission_title: "Mission Statement",
about_mission_desc: "Based on the Christian spirit, we actively provide warm care, education, and resource networking to help restore and rebuild their lives. Through this, we prepare them to be leaders who drive change in the future.",
about_mission_li1: "1. Worship God in spirit and truth.",
about_mission_li2: "2. Help restore the freedom and human rights of North Koreans and North Korean refugees.",
about_mission_li3: "3. Mobilize and network partners aiming for New Korea, training and establishing them as committed unification workers.",
about_mission_li4: "4. Evangelize the next generation of North Korean refugees and raise them as disciples of the Lord.",
about_mission_li5: "5. Share the love of Christ with North Koreans and North Korean refugees through relief.",
about_mission_li6: "6. Heal and restore the souls and lives of wounded North Koreans and North Korean refugees.",
about_ministry_title: "NKFI Ministry",
about_ministry_card1_title: "Mobilization",
about_ministry_card1_desc: "Raising people who prepare for New Korea",
about_ministry_card2_title: "Training",
about_ministry_card2_desc: "Preparing as disciples of Christ for spiritual reconstruction",
about_ministry_card3_title: "Networking",
about_ministry_card3_desc: "Uniting with organizations preparing for unification",
about_ministry_card4_title: "Relief",
about_ministry_card4_desc: "Rescuing and providing relief to North Koreans and North Korean refugees",
about_founder_title: "Founder: Kenneth Bae",
about_founder_desc_title: "735 Days of Detention, and the Mission Thereafter",
about_founder_profile1: "Founder & Representative of NKFI",
about_founder_profile2: "Korean-American Missionary (Pastor)",
about_founder_profile3: "Graduate of University of Oregon",
about_founder_profile4: "Graduate of Covenant Theological Seminary",
about_founder_profile5: "Ordained by Southern Baptist Convention",
about_founder_profile6: "Served as YWAM missionary in China and North Korea, detained for 735 days in North Korea (2012-2014)",
about_founder_book: "Author of 'Not Forgotten'",

// translations.ko에 추가
about_hero_title: "NKFI (뉴코리아 파운데이션 인터내셔널)",
about_hero_subtitle: "북한 주민의 회복, 자유, 그리고 존엄을 향하여",
about_intro_title: "NKFI 소개",
about_intro_p1: "뉴코리아 파운데이션 인터내셔널(NKFI)은 북한에 2년간 억류됐던 케네스 배(Kenneth Bae) 선교사가 세계 각지의 잊혀져가고 소외된 탈북 난민들을 돕고, 통일한국을 준비하기 위하여 2016년 미국에서 시작한 국제 NGO 입니다.",
about_intro_p2: "NKFI는 눈 앞으로 다가온 남북통일에 대비하여 북한의 영적 재건을 위해 동원과 네트워킹, 훈련, 구호를 통해 통일된 뉴코리아의 복음화를 본격화합니다.",
about_intro_info1: "* 전신인 느헤미야 글로벌 이니셔티브(NGI)와 엔케이릴리프(NKRelief)가 통합",
about_intro_info2: "* 미네소타주 미니애폴리스와 한국 서울에 기반을 둔 미국 기반 501(c)(3) 비영리 기관(NGO)",
about_intro_info3: "* KAICAM(한국독립교회선교단체연합회) 소속",
about_vision_title: "비전 선언문",
about_vision_desc: "북한 주민의 회복, 자유, 그리고 존엄을 회복하고, 그리스도 안에서 모든 이에게 평등과 자유가 보장되는 한반도의 통일을 이루는 것입니다. 뉴코리아 파운데이션 인터내셔널은 복음과 성령의 능력을 힘입어 남북한 통일과 북한의 영적 재건에 앞장섭니다.",
about_mission_title: "사명 선언문",
about_mission_desc: "우리는 기독교 정신을 바탕으로 따뜻한 돌봄, 교육, 그리고 자원 네트워킹을 적극적으로 제공하여, 그들의 삶을 회복하고 재건하도록 돕습니다. 이를 통해 그들이 미래에 변화를 이끄는 사람들이 되도록 준비시킵니다.",
about_mission_li1: "1. 영과 진리로 하나님을 예배합니다.",
about_mission_li2: "2. 북한주민과 탈북난민들의 자유와 인권 회복을 돕습니다.",
about_mission_li3: "3. 뉴코리아를 지향하는 동역자들을 동원하고, 네크워킹하여 헌신된 통일사역자로 훈련하고 세워갑니다.",
about_mission_li4: "4. 탈북난민 다음세대를 복음화하고 주님의 제자로 길러냅니다.",
about_mission_li5: "5. 구호를 통해 북한 주민과 탈북난민에게 그리스도의 사랑을 나눕니다.",
about_mission_li6: "6. 상처받은 북한주민과 탈북난민들의 영혼과 삶을 치유하고 회복시킵니다.",
about_ministry_title: "NKFI Ministry",
about_ministry_card1_title: "동원 / Mobilization",
about_ministry_card1_desc: "뉴코리아를 준비하는 사람들을 일으킵니다",
about_ministry_card2_title: "훈련 / Training",
about_ministry_card2_desc: "영적 재건을 위해 그리스도의 제자로 준비시킵니다",
about_ministry_card3_title: "네트워킹 / Networking",
about_ministry_card3_desc: "통일을 준비하는 단체들과 연합합니다.",
about_ministry_card4_title: "구호 / Relief",
about_ministry_card4_desc: "북한 주민과 탈북 난민을 구출하고, 구호합니다.",
about_founder_title: "설립자 : 케네스 배(Kenneth Bae)",
about_founder_desc_title: "735일간의 북한 억류, 그리고 그 이후의 사명",
about_founder_profile1: "현) 뉴코리아 파운데이션 인터내셔널(NKFI) 대표",
about_founder_profile2: "한국계 미국인 선교사(목사)",
about_founder_profile3: "미국 오리건 대학(University of Oregon) 졸업",
about_founder_profile4: "미국 커버넌트 신학대학원(Covenant Theological Seminary) 졸업",
about_founder_profile5: "미국 남침례교(Southern Baptist) 안수",
about_founder_profile6: "국제 YWAM 파송 선교사로 중국과 북한에서 사역 중 735일간 북한 억류(2012~2014)",
about_founder_book: "저서 ‘잊지 않았다’",
```

- [ ] **Step 2: 변경 사항 커밋**

```bash
git add script.js
git commit -m "feat: add i18n translations for NKFI about page"
```

---

### Task 2: `about.html` 신규 페이지 생성

**Files:**
- Create: `about.html`

- [ ] **Step 1: 디자인 사양서에 따른 `about.html` 기본 마크업 작성**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title data-i18n-key="page_title">뉴코리아 희망방송 (NKHB)</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet">
</head>
<body class="about-page">
    <header>
        <nav>
            <div class="logo">
                <a href="/">
                    <img src="https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png" alt="NKHB 로고">
                </a>
            </div>
            <div class="nav-container">
                <ul class="nav-links">
                    <li><a href="/" data-i18n-key="nav_home">홈으로</a></li>
                </ul>
                <div class="lang-selector">
                    <a href="#" class="active" data-lang="ko">한국어</a>
                    <div class="lang-divider"></div>
                    <a href="#" data-lang="en">EN</a>
                </div>
            </div>
        </nav>
    </header>

    <main>
        <section class="about-hero">
            <div class="container">
                <h1 data-i18n-key="about_hero_title">NKFI (뉴코리아 파운데이션 인터내셔널)</h1>
                <p class="subtitle" data-i18n-key="about_hero_subtitle">북한 주민의 회복, 자유, 그리고 존엄을 향하여</p>
            </div>
        </section>

        <section class="section about-intro">
            <div class="container">
                <div class="content-grid">
                    <div class="text-content">
                        <h2 data-i18n-key="about_intro_title">NKFI 소개</h2>
                        <p data-i18n-key="about_intro_p1"></p>
                        <p data-i18n-key="about_intro_p2"></p>
                        <ul class="info-list">
                            <li data-i18n-key="about_intro_info1"></li>
                            <li data-i18n-key="about_intro_info2"></li>
                            <li data-i18n-key="about_intro_info3"></li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section class="section about-values">
            <div class="container">
                <div class="vision-box">
                    <h2 data-i18n-key="about_vision_title">비전 선언문</h2>
                    <p data-i18n-key="about_vision_desc"></p>
                </div>
                <div class="mission-box">
                    <h2 data-i18n-key="about_mission_title">사명 선언문</h2>
                    <p class="mission-desc" data-i18n-key="about_mission_desc"></p>
                    <div class="mission-grid">
                        <div class="mission-item" data-i18n-key="about_mission_li1"></div>
                        <div class="mission-item" data-i18n-key="about_mission_li2"></div>
                        <div class="mission-item" data-i18n-key="about_mission_li3"></div>
                        <div class="mission-item" data-i18n-key="about_mission_li4"></div>
                        <div class="mission-item" data-i18n-key="about_mission_li5"></div>
                        <div class="mission-item" data-i18n-key="about_mission_li6"></div>
                    </div>
                </div>
            </div>
        </section>

        <section class="section about-ministry">
            <div class="container">
                <h2 class="section-title" data-i18n-key="about_ministry_title">NKFI Ministry</h2>
                <div class="ministry-grid">
                    <div class="ministry-card">
                        <h3 data-i18n-key="about_ministry_card1_title"></h3>
                        <p data-i18n-key="about_ministry_card1_desc"></p>
                    </div>
                    <div class="ministry-card">
                        <h3 data-i18n-key="about_ministry_card2_title"></h3>
                        <p data-i18n-key="about_ministry_card2_desc"></p>
                    </div>
                    <div class="ministry-card">
                        <h3 data-i18n-key="about_ministry_card3_title"></h3>
                        <p data-i18n-key="about_ministry_card3_desc"></p>
                    </div>
                    <div class="ministry-card">
                        <h3 data-i18n-key="about_ministry_card4_title"></h3>
                        <p data-i18n-key="about_ministry_card4_desc"></p>
                    </div>
                </div>
            </div>
        </section>

        <section class="section about-founder">
            <div class="container">
                <div class="founder-grid">
                    <div class="founder-image">
                        <img src="https://cdn.imweb.me/thumbnail/20260424/1e888636a0d91.png" alt="케네스 배 선교사">
                        <p class="caption">Kenneth Bae | NKFI 대표</p>
                    </div>
                    <div class="founder-info">
                        <h2 data-i18n-key="about_founder_title"></h2>
                        <h3 class="highlight-title" data-i18n-key="about_founder_desc_title"></h3>
                        <ul class="profile-list">
                            <li data-i18n-key="about_founder_profile1"></li>
                            <li data-i18n-key="about_founder_profile2"></li>
                            <li data-i18n-key="about_founder_profile3"></li>
                            <li data-i18n-key="about_founder_profile4"></li>
                            <li data-i18n-key="about_founder_profile5"></li>
                            <li data-i18n-key="about_founder_profile6"></li>
                        </ul>
                        <p class="book-info" data-i18n-key="about_founder_book"></p>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p data-i18n-key="footer_copyright"></p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: 변경 사항 커밋**

```bash
git add about.html
git commit -m "feat: create initial about.html with NKFI content structure"
```

---

### Task 3: `style.css` 업데이트

**Files:**
- Modify: `style.css`

- [ ] **Step 1: About 페이지 전용 스타일 추가 (그리드, 카드, 히로 섹션)**

```css
/* About Page Styles */
.about-hero {
    padding: 120px 0 80px;
    background: var(--primary-color);
    color: white;
    text-align: center;
}

.about-hero h1 {
    font-size: 3rem;
    margin-bottom: 20px;
}

.about-hero .subtitle {
    font-size: 1.5rem;
    opacity: 0.9;
}

.about-intro .info-list {
    margin-top: 20px;
    list-style: none;
    font-size: 0.9rem;
    color: #666;
}

.vision-box {
    background: #f8f9fa;
    padding: 40px;
    border-radius: 12px;
    margin-bottom: 60px;
    text-align: center;
    border-left: 5px solid var(--accent-color);
}

.mission-box {
    margin-bottom: 80px;
}

.mission-desc {
    margin-bottom: 30px;
    font-weight: 500;
}

.mission-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
}

.mission-item {
    padding: 20px;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    font-size: 0.95rem;
}

.ministry-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 25px;
}

.ministry-card {
    padding: 30px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    transition: transform 0.3s ease;
    text-align: center;
}

.ministry-card:hover {
    transform: translateY(-5px);
    border-bottom: 3px solid var(--accent-color);
}

.founder-grid {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 50px;
    align-items: start;
}

.founder-image img {
    width: 100%;
    border-radius: 12px;
}

.founder-image .caption {
    margin-top: 10px;
    text-align: center;
    font-weight: bold;
}

.highlight-title {
    color: var(--accent-color);
    margin: 15px 0;
}

.profile-list {
    list-style: none;
    margin-bottom: 20px;
}

.profile-list li {
    margin-bottom: 8px;
    position: relative;
    padding-left: 15px;
}

.profile-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--accent-color);
}

.book-info {
    font-weight: 500;
    color: var(--primary-color);
}

@media (max-width: 768px) {
    .founder-grid {
        grid-template-columns: 1fr;
    }
    .about-hero h1 {
        font-size: 2rem;
    }
}
```

- [ ] **Step 2: 변경 사항 커밋**

```bash
git add style.css
git commit -m "style: add styles for about page components and layout"
```

---

### Task 4: 메인 페이지 연결 및 마무리

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 메인 페이지 내비게이션 및 섹션에 About 링크 추가**

- Navigation: `방송배경` 옆 또는 적절한 위치에 `NKFI 소개` 링크 추가 (필요 시).
- Background Section: `비워둔 섹션`에 간단한 안내 문구와 `자세히 보기` 버튼 배치하여 `about.html`로 연결.

```html
<!-- index.html의 background 섹션 수정 -->
<section class="section background" id="background">
    <div class="container" style="text-align: center;">
        <h2 data-i18n-key="about_intro_title">NKFI 소개</h2>
        <p style="margin-bottom: 20px;">뉴코리아 희망방송의 모체인 NKFI와 설립자 케네스 배 선교사의 이야기를 확인해 보세요.</p>
        <a href="about.html" class="btn-hero btn-fill">NKFI 소개 자세히 보기</a>
    </div>
</section>
```

- [ ] **Step 2: 변경 사항 커밋**

```bash
git add index.html
git commit -m "feat: link index.html background section to new about page"
```
