# 후원 금액 직접 입력 버튼 추가 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 사용자가 금액을 직접 입력할 수 있는 후원 버튼을 정기 후원 섹션 하단에 추가합니다.

**Architecture:** `index.html`에 버튼 마크업을 추가하고, `style.css`에서 와이드 버튼 스타일을 정의합니다.

**Tech Stack:** HTML5, CSS3

---

### Task 1: index.html에 직접 입력 버튼 추가

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 정기 후원 그리드 하단에 버튼 삽입**

`index.html`의 `.tier-buttons`가 끝나는 지점 바로 뒤에 버튼을 추가합니다.

```html
<div class="tier-buttons">
    <!-- 기존 버튼들 ... -->
</div>
<div class="custom-support-wrap" style="margin-top: 15px;">
    <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=&background=NKFI" class="btn-custom-support" target="_blank" rel="noopener noreferrer">원하는 금액으로 후원하기 (직접 입력) →</a>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add custom donation amount button under recurring support section"
```

---

### Task 2: 직접 입력 버튼 스타일링

**Files:**
- Modify: `style.css`

- [ ] **Step 1: btn-custom-support 클래스 스타일 정의**

`style.css`에 직접 입력 버튼을 위한 스타일을 추가합니다. 와이드한 느낌과 클릭감을 강조합니다.

```css
.custom-support-wrap {
    width: 100%;
}

.btn-custom-support {
    display: block;
    width: 100%;
    padding: 16px;
    border: 1px solid var(--accent-color);
    border-radius: 10px;
    color: var(--accent-color);
    text-decoration: none;
    font-size: 15px;
    font-weight: 700;
    text-align: center;
    transition: var(--transition);
}

.btn-custom-support:hover {
    background-color: var(--accent-color);
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 74, 153, 0.1);
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "style: style the custom donation amount button"
```
