# 대북방송의 역할 상세 페이지 추가 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 대북방송의 역할에 대한 상세 아티클 페이지를 생성하고 메인 페이지에서 연결합니다.

**Architecture:** 메인 페이지에 '자세히 보기' 버튼을 추가하고, 독립된 `about-broadcast.html` 파일을 생성하여 아티클 전용 스타일을 적용합니다.

**Tech Stack:** HTML5, CSS3

---

### Task 1: 아티클 전용 스타일 추가

**Files:**
- Modify: `style.css`

- [ ] **Step 1: style.css에 아티클 관련 클래스 추가**

`style.css` 하단에 아티클 페이지의 가독성을 위한 전용 스타일을 추가합니다.

```css
/* Article Page Styles */
.article-page {
    padding-top: 150px;
    padding-bottom: 120px;
}

.article-container {
    max-width: 750px;
    margin: 0 auto;
    padding: 0 24px;
}

.article-header {
    margin-bottom: 80px;
    text-align: center;
}

.article-tag {
    display: inline-block;
    color: var(--accent-color);
    font-weight: 700;
    font-size: 14px;
    margin-bottom: 20px;
    letter-spacing: 1px;
}

.article-title {
    font-size: clamp(32px, 5vw, 48px);
    font-weight: 800;
    line-height: 1.25;
    word-break: keep-all;
    margin-bottom: 30px;
}

.article-content p {
    font-size: 18px;
    line-height: 1.9;
    color: #333;
    margin-bottom: 40px;
    word-break: keep-all;
}

.article-quote {
    margin: 60px 0;
    padding: 40px;
    background-color: var(--accent-light);
    border-left: 5px solid var(--accent-color);
    border-radius: 0 20px 20px 0;
}

.article-quote p {
    font-size: 22px;
    font-weight: 700;
    color: var(--accent-color);
    margin-bottom: 0;
    line-height: 1.6;
}

.article-footer {
    margin-top: 100px;
    padding-top: 50px;
    border-top: 1px solid #eee;
    text-align: center;
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "style: add article-specific styles for better readability"
```

---

### Task 2: 메인 페이지에 '자세히 읽기' 버튼 추가

**Files:**
- Modify: `index.html`

- [ ] **Step 1: index.html의 Background 섹션 하단에 버튼 추가**

`index.html`의 110라인 부근(`sub-desc` 문단 뒤)에 버튼을 추가합니다.

```html
<p class="description sub-desc">북한 사회에서 라디오는 여전히 가장 현실적이고 효과적인 정보 전달 수단입니다. NKHB는 단순한 정보 제공을 넘어, 청취자들이 '지금 내가 알고 있는 세상이 전부가 아닐 수 있다'는 사실을 깨도로 돕는 것을 목표로 합니다.</p>

<div class="action-area" style="margin-top: 40px;">
    <a href="about-broadcast.html" class="btn-hero btn-outline" style="color: var(--accent-color); border-color: var(--accent-color); display: inline-block;">대북방송의 역할 자세히 읽기 →</a>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add link to about-broadcast article page in background section"
```

---

### Task 3: 상세 아티클 페이지 생성

**Files:**
- Create: `about-broadcast.html`

- [ ] **Step 1: about-broadcast.html 파일 생성 및 내용 작성**

제공된 텍스트를 구조화하여 HTML 파일을 생성합니다. 헤더와 푸터는 `index.html`을 참조하여 동일하게 유지합니다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>대북방송의 역할 - 뉴코리아 희망방송</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>

<header>
    <nav>
        <div class="logo">
            <a href="/">
                <img src="https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png" alt="NKHB 로고">
            </a>
        </div>
        <div class="nav-container">
            <ul class="nav-links">
                <li><a href="/#background">방송배경</a></li>
                <li><a href="/#composition">방송구성</a></li>
                <li><a href="/#effects">기대효과</a></li>
                <li><a href="/#guide">참여 안내</a></li>
            </ul>
        </div>
    </nav>
</header>

<main class="article-page">
    <article class="article-container">
        <header class="article-header">
            <span class="article-tag">Inside NKHB</span>
            <h1 class="article-title">통일을 준비하는 가장 조용하지만 강력한 힘, 대북방송</h1>
        </header>

        <div class="article-content">
            <p>한반도의 통일은 단지 국경을 하나로 잇는 일이 아니다. 그것은 서로 다른 체제 속에서 살아온 사람들의 인식과 가치, 그리고 미래에 대한 이해를 연결하는 과정이다. 그렇기에 통일은 군사나 외교만으로 이루어지지 않는다. 사람의 마음과 생각을 변화시키는 일이 반드시 함께 이루어져야 한다. 바로 이 지점에서 대북방송, 특히 뉴코리아 희망방송과 같은 민간방송의 역할은 결정적으로 중요해진다.</p>

            <p>북한 사회는 정보가 철저히 통제된 공간이다. 외부 세계에 대한 객관적인 정보는 차단되고, 체제에 유리한 내용만 반복적으로 주입된다. 이러한 환경에서는 주민들이 스스로 다른 선택지를 상상하는 것조차 어려워진다. 대북방송은 바로 이 ‘정보의 장벽’을 넘는 통로다. 외부의 사실, 자유로운 사회의 모습, 그리고 인간의 보편적 권리에 대한 이야기를 전달함으로써, 주민들이 처음으로 “다른 삶이 가능하다”는 인식을 갖게 만든다.</p>

            <div class="article-quote">
                <p>"사람은 알게 되는 순간부터 이전과 같은 방식으로 세상을 받아들일 수 없기 때문이다."</p>
            </div>

            <p>이 변화는 작아 보일 수 있지만, 매우 근본적이다. 대북방송은 단순한 뉴스 전달을 넘어, 생각의 기준을 바꾸고 질문을 만들어내는 역할을 한다. “왜 우리는 자유롭게 말할 수 없는가?”, “왜 우리는 이동의 자유가 없는가?”와 같은 질문이 생겨나는 순간, 이미 변화는 시작된 것이다.</p>

            <p>특히 뉴코리아 희망방송과 같은 민간방송은 정부 중심의 메시지와는 다른 신뢰와 접근성을 가진다. 보다 인간적인 이야기, 실제 삶의 경험, 탈북민의 증언, 그리고 희망의 메시지를 통해 청취자들과 정서적으로 연결된다. 이러한 연결은 단순한 정보보다 더 깊은 영향을 미친다. 체제 선전이 아닌 ‘사람의 이야기’는 마음을 움직이고, 공감을 통해 변화를 확산시킨다.</p>

            <p>또한 대북방송은 통일 이후를 준비하는 역할도 수행한다. 통일은 제도만으로 완성되지 않는다. 서로 다른 사회에서 살아온 사람들이 같은 가치 위에서 공존할 수 있어야 한다. 자유민주주의, 법치, 인권, 책임과 같은 개념이 낯선 상태에서 갑작스러운 통합은 혼란을 초래할 수 있다. 대북방송은 이러한 가치들을 미리 소개하고 이해시키는 ‘사전 교육’의 기능을 한다.</p>

            <div class="article-quote">
                <p>"대북방송은 보이지 않는 곳에서 통일의 토대를 쌓는 작업이다."</p>
            </div>

            <p>이는 단순한 이론 전달이 아니다. 자유롭게 자신의 의견을 말하는 사람들의 이야기, 법이 개인을 보호하는 사례, 노력에 따라 삶이 변화하는 경험들을 들려줌으로써, 청취자들이 자연스럽게 새로운 사회의 원리를 이해하도록 돕는다. 다시 말해, 통일 이후의 시민으로 살아갈 준비를 지금부터 가능하게 하는 것이다.</p>

            <p>더 나아가, 대북방송은 남한 사회에도 중요한 메시지를 던진다. 통일은 ‘돕는 대상’과 ‘돕는 주체’의 관계가 아니라, 함께 새로운 나라를 만들어가는 공동의 여정이라는 인식을 확산시킨다. 북한 주민들은 변화의 대상이 아니라, 통일대한민국의 동등한 구성원이라는 점을 상기시킨다.</p>

            <p>결국 총이나 협상 테이블이 아닌, 라디오 전파와 이야기로 사람들의 생각을 바꾸고, 서로 다른 세계를 연결한다. 그리고 그 연결 위에 자유와 인권이 보장된 새로운 통일대한민국의 기초가 세워진다. 지금 이 시대에 대북방송은 선택이 아니라 필수다. 통일을 원한다면, 우리는 먼저 서로를 이해해야 한다. 그리고 이해는 언제나 ‘듣는 것’에서 시작된다.</p>

            <p><strong>그 조용한 소리가, 결국 한반도의 미래를 바꾸는 가장 큰 힘이 될 것이다.</strong></p>
        </div>

        <footer class="article-footer">
            <a href="index.html" class="btn-hero btn-fill-accent">메인으로 돌아가기</a>
        </footer>
    </article>

    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-logo">
                    <img src="https://cdn.imweb.me/thumbnail/20260424/16a5ea55af28a.png" alt="NKHB 로고" style="filter: brightness(0) invert(1);">
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2026 뉴코리아 희망방송. All rights reserved.</p>
                </div>
            </div>
        </div>
    </footer>
</main>

<script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add about-broadcast.html
git commit -m "feat: create about-broadcast article page with full content"
```
