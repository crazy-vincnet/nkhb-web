# 디자인 문서: 희망의 편지 코너 안내 문구 추가

- **작성일:** 2026-04-27
- **상태:** 승인됨
- **관련 섹션:** 희망의 편지 보내기 (`#guide`)

## 1. 개요
'희망의 편지' 코너가 매일 방송된다는 사실을 알리고, 사용자들이 일회성 참여에 그치지 않고 지속적으로 북한 주민들에게 메시지를 보낼 수 있도록 독려하는 안내 문구를 추가합니다.

## 2. 디자인 전략 (시안 C: Elegant Tip)
- **위치:** `✍️ 희망의 편지 보내기` 소제목 바로 아래, 참여 단계(Step) 카드 시작 전.
- **스타일:** 
    - 왼쪽에 브랜드 강조 컬러(`--accent-color`)의 수직선을 배치하여 시선을 집중시킴.
    - 여백과 서체 크기를 조절하여 '중요 팁' 또는 '에디터의 한마디' 같은 세련된 분위기 연출.
    - 본문보다는 약간 작은 사이즈로 배치하여 보조적인 정보를 전달하면서도 가독성을 유지함.

## 3. 상세 설계

### 3.1 HTML 구조
```html
<div class="participation-sub-section">
    <h3>✍️ 희망의 편지 보내기</h3>
    <!-- 추가될 부분 -->
    <div class="daily-notice">
        <p>이 코너는 매일 방송되기 때문에 많은 참여가 필요합니다. 한 번의 참여도 감사하지만, 북한 주민들이 생각날 때마다 계속해서 메시지를 보내주시면 더욱 감사하겠습니다.</p>
    </div>
    <div class="guide-steps">
        <!-- 기존 내용 -->
    </div>
</div>
```

### 3.2 CSS 스타일링
```css
.daily-notice {
    margin: -15px auto 40px;
    padding: 10px 20px;
    border-left: 3px solid var(--accent-color);
    background-color: transparent;
    max-width: 800px;
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

## 4. 기대 효과
- 사용자가 방송의 시의성(매일 송출)을 인지하여 참여 의지가 높아짐.
- 반복적인 참여가 가능하다는 점을 명시하여 데이터(편지) 확보의 지속성 강화.
- 깔끔한 레이아웃 유지를 통해 기존 디자인의 완성도를 해치지 않음.
