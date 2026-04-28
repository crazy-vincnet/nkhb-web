# 대북방송의 역할 모달 전환 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 별도의 페이지 대신 모달(팝업) 창을 통해 대북방송의 역할 상세 내용을 제공합니다.

**Architecture:** `index.html`에 아티클 전용 모달 마크업을 추가하고, `script.js`로 트리거를 연결하며, 기존에 생성한 `about-broadcast.html`을 삭제합니다.

**Tech Stack:** HTML5, CSS3, JavaScript

---

### Task 1: 모달 스타일 확장 및 아티클 전용 클래스 추가

**Files:**
- Modify: `style.css`

- [ ] **Step 1: 아티클 페이지 스타일 제거 및 모달 스타일 업데이트**

기존에 추가했던 `.article-page` 관련 스타일을 제거하고, 모달을 위한 공통 및 아티클 전용 스타일을 추가합니다.

```css
/* Remove existing article page styles */
/* .article-page, .article-container, etc. ... */

/* Article Modal Specific Styles */
.modal-content.wide {
    max-width: 850px;
}

.modal-body-article {
    max-height: 70vh;
    overflow-y: auto;
    padding: 20px 10px;
    margin-top: 10px;
    text-align: left;
}

/* Custom scrollbar for modal body */
.modal-body-article::-webkit-scrollbar {
    width: 6px;
}
.modal-body-article::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}
.modal-body-article::-webkit-scrollbar-thumb {
    background: var(--accent-color);
    border-radius: 10px;
}

.article-content-inner p {
    font-size: 17px;
    line-height: 1.8;
    color: #333;
    margin-bottom: 30px;
    word-break: keep-all;
}

.article-quote-box {
    margin: 40px 0;
    padding: 30px;
    background-color: var(--accent-light);
    border-left: 4px solid var(--accent-color);
    border-radius: 0 16px 16px 0;
}

.article-quote-box p {
    font-size: 19px;
    font-weight: 700;
    color: var(--accent-color);
    margin-bottom: 0;
    line-height: 1.5;
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "style: add wide modal and article internal styles"
```

---

### Task 2: index.html에 아티클 모달 추가 및 버튼 수정

**Files:**
- Modify: `index.html`

- [ ] **Step 1: '자세히 읽기' 버튼을 모달 트리거로 변경**

```html
<div class="action-area" style="margin-top: 40px;">
    <button id="open-article-modal" class="btn-hero btn-outline" style="color: var(--accent-color); border-color: var(--accent-color); display: inline-block; cursor: pointer; background: transparent;">대북방송의 역할 자세히 읽기 →</button>
</div>
```

- [ ] **Step 2: 페이지 하단(body 태그 닫히기 전)에 모달 마크업 추가**

```html
<!-- Article Modal -->
<div id="article-modal" class="modal">
    <div class="modal-content wide">
        <div class="modal-header">
            <h3>📢 대북방송의 역할</h3>
            <button class="close-modal-article" style="background: #f5f5f7; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 24px; color: #86868b; cursor: pointer;">&times;</button>
        </div>
        <div class="modal-body-article">
            <div class="article-content-inner">
                <p>한반도의 통일은 단지 국경을 하나로 잇는 일이 아니다. 그것은 서로 다른 체제 속에서 살아온 사람들의 인식과 가치, 그리고 미래에 대한 이해를 연결하는 과정이다. 그렇기에 통일은 군사나 외교만으로 이루어지지 않는다. 사람의 마음과 생각을 변화시키는 일이 반드시 함께 이루어져야 한다. 바로 이 지점에서 대북방송, 특히 뉴코리아 희망방송과 같은 민간방송의 역할은 결정적으로 중요해진다.</p>

                <p>북한 사회는 정보가 철저히 통제된 공간이다. 외부 세계에 대한 객관적인 정보는 차단되고, 체제에 유리한 내용만 반복적으로 주입된다. 이러한 환경에서는 주민들이 스스로 다른 선택지를 상상하는 것조차 어려워진다. 대북방송은 바로 이 ‘정보의 장벽’을 넘는 통로다. 외부의 사실, 자유로운 사회의 모습, 그리고 인간의 보편적 권리에 대한 이야기를 전달함으로써, 주민들이 처음으로 “다른 삶이 가능하다”는 인식을 갖게 만든다.</p>

                <div class="article-quote-box">
                    <p>"사람은 알게 되는 순간부터 이전과 같은 방식으로 세상을 받아들일 수 없기 때문이다."</p>
                </div>

                <p>이 변화는 작아 보일 수 있지만, 매우 근본적이다. 대북방송은 단순한 뉴스 전달을 넘어, 생각의 기준을 바꾸고 질문을 만들어내는 역할을 한다. “왜 우리는 자유롭게 말할 수 없는가?”, “왜 우리는 이동의 자유가 없는가?”와 같은 질문이 생겨나는 순간, 이미 변화는 시작된 것이다.</p>

                <p>특히 뉴코리아 희망방송과 같은 민간방송은 정부 중심의 메시지와는 다른 신뢰와 접근성을 가진다. 보다 인간적인 이야기, 실제 삶의 경험, 탈북민의 증언, 그리고 희망의 메시지를 통해 청취자들과 정서적으로 연결된다. 이러한 연결은 단순한 정보보다 더 깊은 영향을 미친다. 체제 선전이 아닌 ‘사람의 이야기’는 마음을 움직이고, 공감을 통해 변화를 확산시킨다.</p>

                <p>또한 대북방송은 통일 이후를 준비하는 역할도 수행한다. 통일은 제도만으로 완성되지 않는다. 서로 다른 사회에서 살아온 사람들이 같은 가치 위에서 공존할 수 있어야 한다. 자유민주주의, 법치, 인권, 책임과 같은 개념이 낯선 상태에서 갑작스러운 통합은 혼란을 초래할 수 있다. 대북방송은 이러한 가치들을 미리 소개하고 이해시키는 ‘사전 교육’의 기능을 한다.</p>

                <div class="article-quote-box">
                    <p>"대북방송은 보이지 않는 곳에서 통일의 토대를 쌓는 작업이다."</p>
                </div>

                <p>이는 단순한 이론 전달이 아니다. 자유롭게 자신의 의견을 말하는 사람들의 이야기, 법이 개인을 보호하는 사례, 노력에 따라 삶이 변화하는 경험들을 들려줌으로써, 청취자들이 자연스럽게 새로운 사회의 원리를 이해하도록 돕는다. 다시 말해, 통일 이후의 시민으로 살아갈 준비를 지금부터 가능하게 하는 것이다.</p>

                <p>더 나아가, 대북방송은 남한 사회에도 중요한 메시지를 던진다. 통일은 ‘돕는 대상’과 ‘돕는 주체’의 관계가 아니라, 함께 새로운 나라를 만들어가는 공동의 여정이라는 인식을 확산시킨다. 북한 주민들은 변화의 대상이 아니라, 통일대한민국의 동등한 구성원이라는 점을 상기시킨다.</p>

                <p>결국 총이나 협상 테이블이 아닌, 라디오 전파와 이야기로 사람들의 생각을 바꾸고, 서로 다른 세계를 연결한다. 그리고 그 연결 위에 자유와 인권이 보장된 새로운 통일대한민국의 기초가 세워진다. 지금 이 시대에 대북방송은 선택이 아니라 필수다. 통일을 원한다면, 우리는 먼저 서로를 이해해야 한다. 그리고 이해는 언제나 ‘듣는 것’에서 시작된다.</p>

                <p><strong>그 조용한 소리가, 결국 한반도의 미래를 바꾸는 가장 큰 힘이 될 것이다.</strong></p>
            </div>
        </div>
    </div>
</div>
```

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add article modal to index.html and update trigger button"
```

---

### Task 3: script.js에 모달 제어 로직 추가

**Files:**
- Modify: `script.js`

- [ ] **Step 1: 아티클 모달 제어 코드 추가**

기존 모달 코드와 유사한 패턴으로 새로운 모달 제어 로직을 추가합니다.

```javascript
// Article Modal Logic
const articleModal = document.getElementById('article-modal');
const openArticleBtn = document.getElementById('open-article-modal');
const closeArticleBtn = document.querySelector('.close-modal-article');

if (openArticleBtn && articleModal && closeArticleBtn) {
    openArticleBtn.addEventListener('click', () => {
        articleModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    });

    closeArticleBtn.addEventListener('click', () => {
        articleModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // 스크롤 허용
    });

    articleModal.addEventListener('click', (e) => {
        if (e.target === articleModal) {
            articleModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "feat: add article modal control logic to script.js"
```

---

### Task 4: 불필요한 파일 삭제 및 최종 정리

- [ ] **Step 1: about-broadcast.html 삭제**

Run: `rm about-broadcast.html`

- [ ] **Step 2: Commit**

```bash
git rm about-broadcast.html
git commit -m "cleanup: remove unnecessary about-broadcast.html page"
```
