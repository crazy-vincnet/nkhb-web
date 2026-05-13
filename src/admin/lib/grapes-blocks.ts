import type { Editor } from 'grapesjs';

export const initNKHBBlocks = (editor: Editor) => {
  const bm = editor.BlockManager;

  const createIcon = (emoji: string) => `
    <div style="font-size: 28px; display: flex; align-items: center; justify-content: center; height: 100%;">${emoji}</div>
  `;

  // --- Category: Layout (레이아웃) ---
  bm.add('nkhb-container', {
    label: '섹션 컨테이너',
    category: 'Layout',
    media: createIcon('📦'),
    content: `<div style="max-width: 1200px; margin: 0 auto; padding: 60px 20px;">
                <p style="text-align: center; color: #999;">컨텐츠를 여기에 넣으세요</p>
              </div>`,
  });

  bm.add('nkhb-grid-2', {
    label: '2단 그리드',
    category: 'Layout',
    media: createIcon('🌓'),
    content: `<div style="display: flex; flex-wrap: wrap; gap: 30px; padding: 20px;">
                <div style="flex: 1; min-width: 300px; border: 1px dashed #eee; padding: 20px;">Column 1</div>
                <div style="flex: 1; min-width: 300px; border: 1px dashed #eee; padding: 20px;">Column 2</div>
              </div>`,
  });

  bm.add('nkhb-grid-3', {
    label: '3단 그리드',
    category: 'Layout',
    media: createIcon('☰'),
    content: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 20px;">
                <div style="padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px dashed #eee;">Item 1</div>
                <div style="padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px dashed #eee;">Item 2</div>
                <div style="padding: 20px; background: #f8fafc; border-radius: 10px; border: 1px dashed #eee;">Item 3</div>
              </div>`,
  });

  bm.add('nkhb-grid-4', {
    label: '4단 그리드',
    category: 'Layout',
    media: createIcon('▦'),
    content: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; padding: 20px;">
                <div style="padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px dashed #eee;">1</div>
                <div style="padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px dashed #eee;">2</div>
                <div style="padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px dashed #eee;">3</div>
                <div style="padding: 15px; background: #f8fafc; border-radius: 10px; border: 1px dashed #eee;">4</div>
              </div>`,
  });

  // --- Category: Basic (기본 요소) ---
  bm.add('text-h1', {
    label: '대제목 (H1)',
    category: 'Basic',
    media: createIcon('➊'),
    content: '<h1 style="font-size: 3rem; font-weight: 800; margin: 20px 0; color: #1e293b;">여기에 대제목을 입력하세요</h1>',
  });

  bm.add('text-h2', {
    label: '중제목 (H2)',
    category: 'Basic',
    media: createIcon('➋'),
    content: '<h2 style="font-size: 2rem; font-weight: 700; margin: 15px 0; color: #1e293b;">중간 제목</h2>',
  });

  bm.add('text-p', {
    label: '본문 텍스트',
    category: 'Basic',
    media: createIcon('¶'),
    content: '<p style="font-size: 1rem; line-height: 1.6; color: #64748b; margin-bottom: 15px;">여기에 본문 내용을 입력하세요. 문단 단위로 작성하기에 좋습니다.</p>',
  });

  bm.add('basic-image', {
    label: '이미지',
    category: 'Basic',
    media: createIcon('🖼️'),
    content: { type: 'image', style: { width: '100%', height: 'auto', 'border-radius': '10px' } },
  });

  bm.add('basic-link', {
    label: '링크',
    category: 'Basic',
    media: createIcon('🔗'),
    content: { type: 'link', content: '링크 텍스트', style: { color: '#2563eb', 'text-decoration': 'underline' } },
  });

  bm.add('basic-button', {
    label: '기본 버튼',
    category: 'Basic',
    media: createIcon('🔘'),
    content: '<a href="#" style="display: inline-block; padding: 12px 25px; background: #2563eb; color: white; border-radius: 8px; text-decoration: none; font-weight: 600;">버튼 텍스트</a>',
  });

  bm.add('basic-list', {
    label: '목록 (List)',
    category: 'Basic',
    media: createIcon('•'),
    content: `
      <ul style="padding-left: 20px; color: #475569; line-height: 1.8;">
        <li>목록 항목 1</li>
        <li>목록 항목 2</li>
        <li>목록 항목 3</li>
      </ul>
    `,
  });

  bm.add('basic-map', {
    label: '지도 (Map)',
    category: 'Basic',
    media: createIcon('🗺️'),
    content: `
      <div style="width: 100%; height: 350px; background: #eee; display: flex; align-items: center; justify-content: center; border-radius: 15px;">
        <p style="color: #999;">여기에 구글 지도 임베드 코드를 넣으세요</p>
      </div>
    `,
  });

  bm.add('basic-spacer', {
    label: '여백 (Spacer)',
    category: 'Basic',
    media: createIcon('↕'),
    content: '<div style="height: 50px; width: 100%;"></div>',
  });

  // --- Category: Sections (섹션) ---
  bm.add('nkhb-hero-modern', {
    label: '모던 히어로',
    category: 'Sections',
    media: createIcon('🖼️'),
    content: `
      <section style="background: linear-gradient(rgba(10,25,47,0.8), rgba(10,25,47,0.8)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80') center/cover; padding: 120px 20px; color: white; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 25px; line-height: 1.2;">세상을 변화시키는 목소리</h1>
          <p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 45px; line-height: 1.6;">진실과 희망의 메시지를 북한 전역으로 전달하여 자유와 회복을 꿈꾸게 합니다.</p>
          <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <a href="#" style="background: #2563eb; color: white; padding: 16px 40px; border-radius: 12px; font-weight: 700; text-decoration: none;">지금 시작하기</a>
            <a href="#" style="border: 2px solid white; color: white; padding: 16px 40px; border-radius: 12px; font-weight: 700; text-decoration: none;">더 알아보기</a>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-features', {
    label: '사역 안내 그리드',
    category: 'Sections',
    media: createIcon('✨'),
    content: `
      <section style="padding: 100px 20px; background: #ffffff;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 70px;">
            <span style="color: #2563eb; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;">What We Do</span>
            <h2 style="font-size: 2.8rem; font-weight: 800; color: #0f172a; margin-top: 10px;">주요 사역 안내</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 35px;">
            <div style="background: #f8fafc; padding: 50px 40px; border-radius: 24px;">
              <div style="width: 64px; height: 64px; background: #dbeafe; color: #2563eb; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; font-size: 28px;">📡</div>
              <h3 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 15px; color: #1e293b;">라디오 송출</h3>
              <p style="color: #64748b; line-height: 1.7;">북한 내부로 가장 안전하고 확실하게 정보를 전달하는 통로입니다.</p>
            </div>
            <div style="background: #f8fafc; padding: 50px 40px; border-radius: 24px;">
              <div style="width: 64px; height: 64px; background: #fef2f2; color: #ef4444; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; font-size: 28px;">📖</div>
              <h3 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 15px; color: #1e293b;">진리의 말씀</h3>
              <p style="color: #64748b; line-height: 1.7;">성경 이야기와 복음을 통해 주민들의 영혼을 깨우고 위로합니다.</p>
            </div>
            <div style="background: #f8fafc; padding: 50px 40px; border-radius: 24px;">
              <div style="width: 64px; height: 64px; background: #f0fdf4; color: #22c55e; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 25px; font-size: 28px;">🕊️</div>
              <h3 style="font-size: 1.6rem; font-weight: 700; margin-bottom: 15px; color: #1e293b;">회복과 소망</h3>
              <p style="color: #64748b; line-height: 1.7;">음악과 생활 정보를 통해 일상의 작은 여유와 회복을 선물합니다.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-image-text-overlap', {
    label: '이미지 & 텍스트',
    category: 'Sections',
    media: createIcon('🎞️'),
    content: `
      <section style="padding: 100px 20px; overflow: hidden;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 60px;">
          <div style="flex: 1; min-width: 400px; position: relative;">
            <div style="position: absolute; top: -30px; left: -30px; width: 200px; height: 200px; background: #dbeafe; border-radius: 40px; z-index: -1;"></div>
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80" style="width: 100%; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.15);" />
          </div>
          <div style="flex: 1; min-width: 400px;">
            <h2 style="font-size: 2.8rem; font-weight: 800; color: #1e293b; line-height: 1.2; margin-bottom: 30px;">당신의 관심이 <br/><span style="color: #2563eb;">기적</span>이 됩니다</h2>
            <p style="color: #64748b; font-size: 1.1rem; line-height: 1.8; margin-bottom: 35px;">우리는 보이지 않는 곳에서 변화를 만들어가고 있습니다. 라디오 한 대가 전달하는 소리는 한 사람의 일생을 바꾸는 거대한 울림이 됩니다.</p>
            <a href="#" style="display: inline-block; padding: 14px 35px; background: #1e293b; color: white; border-radius: 14px; text-decoration: none; font-weight: 700;">캠페인 참여하기</a>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-cta-blue', {
    label: '파란색 CTA 배너',
    category: 'Sections',
    media: createIcon('📣'),
    content: `
      <section style="padding: 60px 20px; background: #2563eb; color: white; border-radius: 30px; margin: 40px 20px;">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; items-center; justify-content: space-between; gap: 30px;">
          <h2 style="font-size: 1.8rem; font-weight: 800; margin: 0;">지금 북한 주민들에게 희망을 전하세요</h2>
          <a href="/#support" style="background: white; color: #2563eb; padding: 15px 40px; border-radius: 50px; font-weight: 800; text-decoration: none;">후원하기</a>
        </div>
      </section>
    `,
  });

  // --- Category: Profiles (프로필) ---
  bm.add('nkhb-founder-v2', {
    label: '설립자 프로필',
    category: 'Profiles',
    media: createIcon('👤'),
    content: `
      <section style="padding: 100px 20px; background: #f8fafc; border-radius: 40px; margin: 40px 20px;">
        <div style="max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 60px; align-items: center;">
          <div style="flex: 1; min-width: 300px; text-align: center;">
            <img src="/images/kenneth-bae.png" style="width: 100%; max-width: 350px; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.1);" />
          </div>
          <div style="flex: 1.5; min-width: 350px;">
            <span style="color: #2563eb; font-weight: 800; letter-spacing: 2px;">FOUNDER</span>
            <h2 style="font-size: 2.5rem; font-weight: 900; margin: 10px 0 25px;">Kenneth Bae</h2>
            <p style="font-size: 1.2rem; color: #334155; line-height: 1.6; font-style: italic; margin-bottom: 25px;">"진리가 너희를 자유케 하리니"</p>
            <p style="color: #64748b; line-height: 1.8;">735일간의 북한 억류 기간 동안 경험한 하나님의 사랑과 희망을 북한 주민들에게 전하는 것이 저의 소명입니다.</p>
          </div>
        </div>
      </section>
    `,
  });

  // --- Category: Information (정보/안내) ---
  bm.add('nkhb-faq', {
    label: '자주 묻는 질문',
    category: 'Information',
    media: createIcon('❓'),
    content: `
      <div style="padding: 60px 20px; max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; margin-bottom: 40px; font-weight: 800;">자주 묻는 질문</h2>
        <div style="border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden;">
          <div style="padding: 20px 30px; background: white; border-bottom: 1px solid #e2e8f0;">
            <p style="font-weight: 800; color: #2563eb; margin-bottom: 5px;">Q. 후원금은 어떻게 사용되나요?</p>
            <p style="color: #64748b; margin: 0;">대북 라디오 방송 제작 및 송출, 탈북민 구호 활동에 투명하게 사용됩니다.</p>
          </div>
          <div style="padding: 20px 30px; background: white;">
            <p style="font-weight: 800; color: #2563eb; margin-bottom: 5px;">Q. 방송은 언제 송출되나요?</p>
            <p style="color: #64748b; margin: 0;">주 6일(월~토) 지정된 시간과 주파수를 통해 북한 전역으로 송출됩니다.</p>
          </div>
        </div>
      </div>
    `,
  });

  bm.add('nkhb-audio-list', {
    label: '방송 다시듣기 목록',
    category: 'Information',
    media: createIcon('📻'),
    content: `
      <div style="padding: 40px 20px; max-width: 800px; margin: 0 auto; background: white; border-radius: 30px; border: 1px solid #f1f5f9;">
        <h3 style="font-weight: 800; margin-bottom: 30px; display: flex; items-center; gap: 10px;">📻 방송 다시듣기</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="padding: 15px 20px; background: #f8fafc; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600;">희망의 편지 - 2026.05.10</span>
            <button style="padding: 6px 15px; background: #2563eb; color: white; border-radius: 50px; border: none; font-size: 12px; cursor: pointer;">듣기</button>
          </div>
          <div style="padding: 15px 20px; background: #f8fafc; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600;">진리의 말씀 - 2026.05.08</span>
            <button style="padding: 6px 15px; background: #2563eb; color: white; border-radius: 50px; border: none; font-size: 12px; cursor: pointer;">듣기</button>
          </div>
        </div>
      </div>
    `,
  });

  // --- Category: Forms (폼 요소) ---
  bm.add('nkhb-contact-form', {
    label: '문의하기 양식',
    category: 'Forms',
    media: createIcon('📝'),
    content: `
      <form style="max-width: 500px; margin: 40px auto; padding: 40px; background: #f8fafc; border-radius: 30px;">
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-weight: 700; margin-bottom: 8px; font-size: 13px;">성함</label>
          <input type="text" style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0;" />
        </div>
        <div style="margin-bottom: 25px;">
          <label style="display: block; font-weight: 700; margin-bottom: 8px; font-size: 13px;">메시지</label>
          <textarea style="width: 100%; padding: 12px; border-radius: 10px; border: 1px solid #e2e8f0; min-height: 100px;"></textarea>
        </div>
        <button style="width: 100%; padding: 15px; background: #2563eb; color: white; border-radius: 10px; border: none; font-weight: 800;">메시지 보내기</button>
      </form>
    `,
  });

  // --- Category: Elements (요소) ---
  bm.add('nkhb-button-fancy', {
    label: '포인트 버튼',
    category: 'Elements',
    media: createIcon('🖱️'),
    content: `<a href="#" style="display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border-radius: 50px; font-weight: 800; text-decoration: none; box-shadow: 0 10px 20px rgba(37,99,235,0.2);">시작하기</a>`,
  });

  bm.add('nkhb-video-pro', {
    label: '고급 비디오',
    category: 'Elements',
    media: createIcon('🎥'),
    content: `
      <div style="max-width: 800px; margin: 40px auto; position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
        <iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" src="https://www.youtube.com/embed/dQw4w9WgXcQ" allowfullscreen></iframe>
      </div>
    `,
  });

  bm.add('nkhb-divider', {
    label: '세련된 구분선',
    category: 'Elements',
    media: createIcon('➖'),
    content: `<hr style="border: 0; height: 1px; background: linear-gradient(to right, transparent, #cbd5e1, transparent); margin: 60px 0;" />`,
  });

  bm.add('nkhb-stat-card', {
    label: '수치 통계 카드',
    category: 'Elements',
    media: createIcon('📊'),
    content: `
      <div style="padding: 35px; background: white; border-radius: 24px; text-align: center; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
        <p style="font-size: 2.5rem; font-weight: 900; color: #2563eb; margin: 0;">1,200+</p>
        <p style="font-size: 0.9rem; color: #64748b; font-weight: 700; margin-top: 10px;">누적 방송 시간</p>
      </div>
    `,
  });
};
