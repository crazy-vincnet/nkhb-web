# 희망의 편지 코너 안내 문구 추가 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** '희망의 편지' 코너의 참여를 독려하는 안내 문구를 추가하고 시안 C(Elegant Tip) 스타일로 스타일링합니다.

**Architecture:** HTML 구조에 새로운 알림 영역을 추가하고, CSS 변수를 활용하여 기존 디자인과 조화로운 스타일을 적용합니다.

**Tech Stack:** HTML5, CSS3

---

### Task 1: CSS 스타일 정의 (시안 C 스타일)

**Files:**
- Modify: `style.css`

- [ ] **Step 1: CSS에 .daily-notice 스타일 추가**

`style.css`의 적절한 위치(Participation Guide 섹션 관련 스타일 근처)에 다음 코드를 추가합니다.

```css
/* Daily Notice (Style C: Elegant Tip) */
.daily-notice {
    margin: -15px auto 40px;
    padding: 10px 20px;
    border-left: 3px solid var(--accent-color);
    background-color: transparent;
    max-width: 900px; /* 기존 섹션 너비와 맞춤 */
    text-align: left;
}

.daily-notice p {
    font-size: 15px;
    color: var(--text-light);
    line-height: 1.7;
    word-break: keep-all;
    font-weight: 500;
}
```

- [ ] **Step 2: 저장 및 확인**

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "style: add styles for daily notice in letter of hope section"
```

---

### Task 2: HTML 마크업 추가

**Files:**
- Modify: `index.html`

- [ ] **Step 1: index.html에 안내 문구 삽입**

`index.html` 파일에서 `<div class="participation-sub-section">` 내부의 `<h3>✍️ 희망의 편지 보내기</h3>` 바로 다음에 아래 코드를 삽입합니다.

```html
<div class="daily-notice">
    <p>이 코너는 매일 방송되기 때문에 많은 참여가 필요합니다. 한 번의 참여도 감사하지만, 북한 주민들이 생각날 때마다 계속해서 메시지를 보내주시면 더욱 감사하겠습니다.</p>
</div>
```

- [ ] **Step 2: 저장 및 브라우저 확인 (시뮬레이션)**
HTML 구조가 깨지지 않았는지, 문구가 소제목과 참여 단계 사이에 잘 배치되었는지 확인합니다.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add daily notice message to letter of hope section"
```
