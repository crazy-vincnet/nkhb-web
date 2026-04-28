# About Us 페이지 가독성 및 모바일 최적화 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `about.html` 페이지의 텍스트 가독성을 높이고 모바일 환경에서의 레이아웃과 사용자 경험을 개선합니다.

**Architecture:** `style.css` 내의 About 페이지 전용 스타일 영역을 수정하여 유동적 타이포그래피(`clamp`), 줄 간격 최적화, 모바일 여백 조정 및 시각적 폴리싱을 적용합니다.

**Tech Stack:** Vanilla CSS.

---

### Task 1: Hero & Intro & Values Section 스타일 최적화

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Hero, Intro, Values 영역의 스타일 수정**

```css
/* style.css 파일의 About Page Styles 섹션 수정 */

.about-hero h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    margin-bottom: 20px;
}

.about-hero .subtitle {
    font-size: clamp(1.2rem, 3vw, 1.5rem);
    opacity: 0.9;
}

/* 추가할 내용: Intro 섹션 가독성 */
.about-intro .text-content p {
    line-height: 1.8;
    margin-bottom: 20px;
    font-size: 1.05rem;
}

.vision-box {
    background: #f8f9fa;
    padding: clamp(30px, 5vw, 50px);
    border-radius: 12px;
    margin-bottom: 60px;
    text-align: center;
    border-left: 5px solid var(--accent-color);
    font-size: 1.1rem;
    line-height: 1.8;
}

.mission-desc {
    margin-bottom: 30px;
    font-weight: 500;
    font-size: 1.05rem;
    line-height: 1.7;
}

.mission-item {
    padding: 20px;
    background: white;
    border: 1px solid rgba(0,0,0,0.05);
    border-radius: 12px;
    font-size: 0.95rem;
    line-height: 1.6;
    box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}

```

- [ ] **Step 2: 커밋**

```bash
git add style.css
git commit -m "style: optimize hero, intro, and values typography and spacing"
```

---

### Task 2: Cards & Founder Section 스타일 및 모바일 대응 최적화

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Ministry Card 및 Founder 섹션, 미디어 쿼리 수정**

```css
/* style.css 수정 */

.ministry-card {
    padding: clamp(25px, 4vw, 40px);
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.06);
    transition: transform 0.3s ease;
    text-align: center;
}

/* 추가/수정: Founder 리스트 가독성 */
.profile-list li {
    margin-bottom: 12px;
    position: relative;
    padding-left: 15px;
    line-height: 1.7;
    font-size: 1.05rem;
}

.profile-list li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 2px;
    color: var(--accent-color);
}

/* 모바일 미디어 쿼리 업데이트 */
@media (max-width: 768px) {
    .about-hero {
        padding: 100px 0 60px;
    }
    
    .founder-grid {
        grid-template-columns: 1fr;
        gap: 30px;
    }
    
    .founder-image img {
        max-width: 100%;
        margin: 0 auto;
        display: block;
    }

    .mission-grid {
        grid-template-columns: 1fr;
        gap: 15px;
    }

    .cta-buttons {
        flex-direction: column;
        gap: 10px;
    }
    
    .cta-buttons .btn-fill-accent,
    .cta-buttons .btn-outline-dark {
        width: 100%;
        padding: 16px 20px;
    }
}
```

- [ ] **Step 2: 커밋**

```bash
git add style.css
git commit -m "style: enhance cards shadow and mobile layouts for about page"
```
