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
  bm.add('nkhb-hero-video', {
    label: '비디오 히어로',
    category: 'Sections',
    media: createIcon('🎬'),
    content: `
      <section style="position: relative; height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; color: white;">
        <video autoplay muted loop style="position: absolute; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; z-index: -1; transform: translate(-50%, -50%); object-fit: cover;">
          <source src="https://assets.mixkit.co/videos/preview/mixkit-clouds-and-blue-sky-2408-large.mp4" type="video/mp4">
        </video>
        <div style="background: rgba(0,0,0,0.4); position: absolute; inset: 0; z-index: 0;"></div>
        <div style="position: relative; z-index: 1; text-align: center; max-width: 900px; padding: 0 20px;">
          <h1 style="font-size: 4rem; font-weight: 900; margin-bottom: 20px;">희망은 소리 없이 찾아옵니다</h1>
          <p style="font-size: 1.4rem; opacity: 0.9; margin-bottom: 40px;">진실의 파동이 북한 전역으로 퍼져나가는 순간</p>
          <a href="#" style="background: #2563eb; color: white; padding: 18px 50px; border-radius: 50px; font-weight: 800; text-decoration: none; font-size: 1.1rem; box-shadow: 0 15px 30px rgba(37,99,235,0.3);">지금 라이브 듣기</a>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-schedule-grid', {
    label: '방송 시간표 섹션',
    category: 'Sections',
    media: createIcon('⏰'),
    content: `
      <section style="padding: 100px 20px; background: #0f172a; color: white;">
        <div style="max-width: 1100px; margin: 0 auto;">
          <h2 style="text-align: center; font-size: 2.5rem; font-weight: 800; margin-bottom: 60px;">라디오 방송 편성표</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
            <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: #3b82f6; font-size: 1.2rem; margin-bottom: 20px;">월 · 수 · 금</h3>
                <div style="font-size: 2.2rem; font-weight: 800; margin-bottom: 10px;">02:30 - 03:00</div>
                <div style="opacity: 0.6;">주파수: 5920 kHz</div>
            </div>
            <div style="background: rgba(255,255,255,0.05); padding: 40px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);">
                <h3 style="color: #3b82f6; font-size: 1.2rem; margin-bottom: 20px;">화 · 목 · 토</h3>
                <div style="font-size: 2.2rem; font-weight: 800; margin-bottom: 10px;">23:00 - 23:30</div>
                <div style="opacity: 0.6;">주파수: 9470 kHz</div>
            </div>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-donation-cards', {
    label: '후원 옵션 카드',
    category: 'Sections',
    media: createIcon('❤️'),
    content: `
      <section style="padding: 100px 20px;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
            <div style="border: 2px solid #f1f5f9; padding: 40px; border-radius: 30px; text-align: center; transition: all 0.3s;">
                <div style="font-size: 40px; margin-bottom: 20px;">📻</div>
                <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 15px;">라디오 보내기</h3>
                <p style="color: #64748b; margin-bottom: 25px;">북한 주민 한 명에게 정보를 전달할 소중한 도구를 선물합니다.</p>
                <div style="font-size: 1.8rem; font-weight: 900; color: #2563eb; margin-bottom: 25px;">$25</div>
                <a href="#" style="display: block; padding: 15px; background: #f1f5f9; color: #1e293b; border-radius: 15px; text-decoration: none; font-weight: 700;">선택하기</a>
            </div>
            <div style="border: 2px solid #2563eb; padding: 40px; border-radius: 30px; text-align: center; background: #eff6ff;">
                <div style="font-size: 40px; margin-bottom: 20px;">🎙️</div>
                <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 15px;">방송 제작 지원</h3>
                <p style="color: #64748b; margin-bottom: 25px;">한 시간 분량의 고품질 콘텐츠가 제작될 수 있도록 돕습니다.</p>
                <div style="font-size: 1.8rem; font-weight: 900; color: #2563eb; margin-bottom: 25px;">$100</div>
                <a href="#" style="display: block; padding: 15px; background: #2563eb; color: white; border-radius: 15px; text-decoration: none; font-weight: 700;">가장 인기있는 항목</a>
            </div>
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

  bm.add('nkhb-letter-cta', {
    label: '희망의 편지 CTA',
    category: 'Sections',
    media: createIcon('✉️'),
    content: `
      <section style="padding: 80px 20px; background: #fff7ed; border-radius: 40px; margin: 40px 20px; border: 2px dashed #ffedd5;">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
          <div style="font-size: 50px; margin-bottom: 20px;">✉️</div>
          <h2 style="font-size: 2.2rem; font-weight: 800; color: #9a3412; margin-bottom: 20px;">북한 주민에게 희망의 편지를 보내주세요</h2>
          <p style="font-size: 1.1rem; color: #c2410c; margin-bottom: 35px; line-height: 1.6;">당신의 따뜻한 말 한마디가 누군가에게는 삶을 지탱하는 커다란 힘이 됩니다. 지금 마음을 전해보세요.</p>
          <a href="/#letters" style="display: inline-block; background: #ea580c; color: white; padding: 16px 45px; border-radius: 15px; font-weight: 800; text-decoration: none; box-shadow: 0 10px 20px rgba(234,88,12,0.2);">편지 쓰러 가기</a>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-impact-story', {
    label: '임팩트 스토리',
    category: 'Sections',
    media: createIcon('📖'),
    content: `
      <section style="padding: 100px 20px;">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 50px; align-items: center; background: #f8fafc; padding: 60px; border-radius: 40px;">
          <div style="flex: 1; min-width: 300px;">
            <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80" style="width: 100%; border-radius: 20px; filter: grayscale(100%) sepia(20%);" />
          </div>
          <div style="flex: 1.5; min-width: 300px;">
            <div style="font-size: 60px; color: #cbd5e1; margin-bottom: -20px;">"</div>
            <p style="font-size: 1.4rem; font-weight: 600; color: #1e293b; line-height: 1.6; margin-bottom: 25px;">라디오에서 들려오는 목소리는 마치 어두운 방 안에 켜진 작은 등불 같았습니다. 저는 그 소리를 통해 제가 혼자가 아니라는 것을 알게 되었습니다.</p>
            <div style="font-weight: 800; color: #2563eb;">- 익명의 청취자 소감 중</div>
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
