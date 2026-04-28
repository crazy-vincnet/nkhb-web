# 후원 섹션 링크 연결 및 개편 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 정기 후원 및 방송 제작 후원 버튼에 결제 링크를 연결하고 일시 후원 섹션을 제거합니다.

**Architecture:** `index.html`의 후원 섹션 마크업을 수정하여 링크를 삽입하고 레이아웃을 조정합니다.

**Tech Stack:** HTML5, CSS3

---

### Task 1: index.html 후원 버튼 링크 및 구조 수정

**Files:**
- Modify: `index.html`

- [ ] **Step 1: 정기 후원 버튼 업데이트 및 20만원 추가**

기존 `tier-buttons` 영역을 아래와 같이 수정합니다.

```html
<div class="support-item">
    <h5>정기 후원</h5>
    <div class="tier-buttons">
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=30000&background" class="tier-btn" target="_blank" rel="noopener noreferrer">3만원</a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=50000&background" class="tier-btn" target="_blank" rel="noopener noreferrer">5만원</a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=100000&background" class="tier-btn" target="_blank" rel="noopener noreferrer">10만원</a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=200000&background" class="tier-btn" target="_blank" rel="noopener noreferrer">20만원</a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=300000&background" class="tier-btn" target="_blank" rel="noopener noreferrer">30만원</a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=pledge&price=500000&background" class="tier-btn" target="_blank" rel="noopener noreferrer">50만원</a>
    </div>
</div>
```

- [ ] **Step 2: 일시 후원 섹션 삭제 및 레이아웃 조정**

기존 '일시 후원'에 해당하는 `<div class="support-item">...</div>` 영역을 삭제합니다. 정기 후원 영역이 전체 너비를 사용하도록 `support-grid` 구조를 확인합니다.

- [ ] **Step 3: 방송 제작 및 송출 지원 항목 업데이트**

항목을 6개로 확장하고 링크를 연결합니다.

```html
<div class="production-support">
    <h5>🎙 방송 제작 및 송출 지원</h5>
    <div class="production-grid">
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=200000" class="prod-btn" target="_blank" rel="noopener noreferrer"><strong>20만원</strong> <span>30분 방송 제작</span></a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=400000" class="prod-btn" target="_blank" rel="noopener noreferrer"><strong>40만원</strong> <span>60분 방송 제작</span></a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=800000" class="prod-btn" target="_blank" rel="noopener noreferrer"><strong>80만원</strong> <span>120분 방송 제작</span></a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=1200000" class="prod-btn" target="_blank" rel="noopener noreferrer"><strong>120만원</strong> <span>180분 방송 제작</span></a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=3000000" class="prod-btn" target="_blank" rel="noopener noreferrer"><strong>300만원</strong> <span>1주일 방송 제작</span></a>
        <a href="https://secure.donus.org/ngi/pay/step1?dontype=CMP&period=oneoff&price=12000000" class="prod-btn" target="_blank" rel="noopener noreferrer"><strong>1200만원</strong> <span>1달 방송 제작</span></a>
    </div>
</div>
```

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: update support links and layout, remove one-off support section"
```

---

### Task 2: CSS 레이아웃 미세 조정

**Files:**
- Modify: `style.css`

- [ ] **Step 1: 정기 후원 그리드 스타일 수정**

일시 후원이 삭제되었으므로 정기 후원 섹션이 중앙에 오거나 더 보기 좋게 배치되도록 조정합니다.

```css
.support-grid {
    display: flex;
    justify-content: center; /* 중앙 정렬 */
    margin-bottom: 50px;
}

.support-item {
    max-width: 600px;
    width: 100%;
}

.tier-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3열로 변경하여 6개 버튼 정렬 */
    gap: 12px;
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "style: optimize support section grid layout"
```
