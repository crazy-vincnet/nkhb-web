# 방송 시간 섹션 다크 테마 전환 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 방송 시간 섹션(`#schedule`)에 다크 테마를 적용하여 이전 섹션과 명확히 구분되도록 합니다.

**Architecture:** `style.css`에서 `.schedule` 섹션의 배경색, 텍스트 색상, 카드 그림자 등을 업데이트합니다.

**Tech Stack:** CSS3

---

### Task 1: 방송 시간 섹션 다크 스타일 적용

**Files:**
- Modify: `style.css`

- [ ] **Step 1: .schedule 섹션 기본 스타일 업데이트**

섹션 배경색과 내부 텍스트 색상을 다크 테마에 맞게 수정합니다.

```css
.schedule {
    background-color: #0a192f; /* 다크 네이비 배경 */
    color: #ffffff;
    padding-bottom: 120px;
}

.schedule h2 {
    color: #ffffff;
}

.schedule .description {
    color: rgba(255, 255, 255, 0.7);
}
```

- [ ] **Step 2: 스케줄 카드 스타일 최적화 (플로팅 효과)**

카드 배경은 밝게 유지하되 그림자를 강화하여 입체감을 줍니다.

```css
.schedule-modern-card {
    position: relative;
    background: #ffffff;
    border-radius: 24px;
    padding: 45px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: var(--transition);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3); /* 더 깊은 그림자 */
}

.schedule-modern-card:hover {
    transform: translateY(-15px); /* 호버 시 더 높게 이동 */
    box-shadow: 0 30px 60px rgba(0, 74, 153, 0.4);
}

.schedule-modern-card .info-value {
    color: #1a1a1a; /* 카드 내부 텍스트는 어두운 색 유지 */
}
```

- [ ] **Step 3: 하단 안내 문구 스타일 수정**

```css
.notice-item {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 18px 45px;
    background-color: rgba(255, 255, 255, 0.05); /* 반투명 배경 */
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 600;
}
```

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "style: apply dark theme to broadcast schedule section for better separation"
```
