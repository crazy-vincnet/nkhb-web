# 희망의 편지 코너 가독성 강화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 'Trust Card'의 가독성을 향상시키기 위해 텍스트 위계를 강화하고 핵심 키워드를 강조합니다.

**Architecture:** HTML에 `<strong>` 태그를 활용한 위계를 부여하고, CSS에서 폰트 크기, 줄 간격, 강조 색상을 세밀하게 조정합니다.

**Tech Stack:** HTML5, CSS3

---

### Task 1: 가독성 강화 CSS 적용

**Files:**
- Modify: `style.css`

- [ ] **Step 1: CSS에서 .trust-card 및 텍스트 스타일 업데이트**

`style.css`의 `trust-card` 관련 스타일을 최적화된 수치로 업데이트합니다.

```css
/* Trust Card Style (Readability Enhanced) */
.trust-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 60px 45px;
    border: 1px solid #e1e8ef;
    box-shadow: 0 15px 40px rgba(0,0,0,0.04);
    max-width: 850px;
    margin: -10px auto 70px;
    text-align: center;
    position: relative;
}

.trust-card .intro-text {
    font-size: 17px;
    color: #111;
    line-height: 1.9;
    word-break: keep-all;
    max-width: 700px;
    margin: 0 auto;
}

.trust-card .intro-text strong {
    color: var(--accent-color);
    font-weight: 700;
}

.card-divider {
    height: 1px;
    background: #e1e8ef;
    margin: 40px auto;
    max-width: 120px;
}

.trust-card .notice-text {
    font-size: 16px;
    color: var(--accent-color);
    line-height: 1.8;
    word-break: keep-all;
    font-weight: 600;
}

.trust-card .notice-text strong {
    font-weight: 800;
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
}
```

- [ ] **Step 2: 저장 및 확인**

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "style: enhance trust card readability with bold hierarchy and spacing"
```

---

### Task 2: HTML 텍스트 위계 적용

**Files:**
- Modify: `index.html`

- [ ] **Step 1: index.html에 강조 태그 및 아이콘 추가**

`index.html`의 `trust-card` 내용을 위계가 강화된 마크업으로 교체합니다.

```html
<div class="trust-card">
    <div class="card-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"></circle><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path></svg>
    </div>
    <div class="card-body">
        <p class="intro-text">
            NKHB에는 <strong>'희망의 편지'</strong>라는 코너가 있습니다. 이 코너에서는 전 세계에서 보내온 메시지를 <strong>북한 청취자</strong>들에게 전하고 있습니다. 북한 주민들에게 전하고 싶은 메시지가 있다면 <strong>누구나 참여</strong>하실 수 있습니다. 보내주신 편지는 <strong>한국어로 번역</strong>되어 <strong>탈북민의 목소리</strong>로 방송됩니다.
        </p>
        <div class="card-divider"></div>
        <p class="notice-text">
            📢 이 코너는 <strong>매일 방송</strong>되기 때문에 많은 참여가 필요합니다. 한 번의 참여도 감사하지만, 북한 주민들이 생각날 때마다 <strong>계속해서 메시지</strong>를 보내주시면 더욱 감사하겠습니다.
        </p>
    </div>
</div>
```

- [ ] **Step 2: 저장 및 구조 확인**

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: apply bold hierarchy and keywords highlighting to trust card"
```
