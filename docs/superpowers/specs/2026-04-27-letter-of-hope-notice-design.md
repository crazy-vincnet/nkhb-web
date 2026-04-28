# 디자인 문서: 희망의 편지 코너 안내 문구 추가

- **작성일:** 2026-04-27
- **상태:** 승인됨
- **관련 섹션:** 희망의 편지 보내기 (`#guide`)

## 1. 개요
'희망의 편지' 코너가 매일 방송된다는 사실을 알리고, 사용자들이 일회성 참여에 그치지 않고 지속적으로 북한 주민들에게 메시지를 보낼 수 있도록 독려하는 안내 문구를 추가합니다.

## 2. 디자인 전략 (옵션 1: Trust Card - 가독성 강화 버전)
- **위치:** `✍️ 희망의 편지 보내기` 소제목 아래, 참여 단계(Step) 카드 시작 전.
- **스타일:** 
    - 화이트 배경의 독립된 카드 형태에 부드러운 그림자와 테두리 적용.
    - **가독성 강화:** 핵심 키워드에 볼드 처리 및 브랜드 컬러를 적용하여 시선 유도.
    - **폰트 최적화:** 폰트 크기를 미세하게 키우고 줄 간격을 넓혀 긴 문장 읽기 편의성 제공.
    - 중앙 정렬 레이아웃을 통해 공신력 있는 안내문의 느낌을 연출.

## 3. 상세 설계

### 3.1 HTML 구조
```html
<div class="participation-sub-section">
    <h3>✍️ 희망의 편지 보내기</h3>
    
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

    <div class="guide-steps">
        <!-- 기존 내용 유지 -->
    </div>
</div>
```

### 3.2 CSS 스타일링
```css
.trust-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 60px 45px;
    border: 1px solid #e1e8ef;
    box-shadow: 0 15px 40px rgba(0,0,0,0.04);
    max-width: 850px; /* 가독성을 위해 너비 소폭 확대 */
    margin: -10px auto 70px;
    text-align: center;
    position: relative;
}

.card-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background-color: var(--accent-light);
    color: var(--accent-color);
    border-radius: 50%;
    margin-bottom: 30px;
}

.trust-card .intro-text {
    font-size: 17px; /* 가독성을 위해 1px 확대 */
    color: #111; /* 대비 강화를 위해 더 짙은 블랙 적용 */
    line-height: 1.9; /* 줄 간격 확대 */
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

## 4. 기대 효과
- 사용자가 방송의 시의성(매일 송출)을 인지하여 참여 의지가 높아짐.
- 반복적인 참여가 가능하다는 점을 명시하여 데이터(편지) 확보의 지속성 강화.
- 깔끔한 레이아웃 유지를 통해 기존 디자인의 완성도를 해치지 않음.
