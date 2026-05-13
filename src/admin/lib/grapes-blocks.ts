import type { Editor } from 'grapesjs';

export const initNKHBBlocks = (editor: Editor) => {
  const bm = editor.BlockManager;

  // --- Category: Layout ---
  bm.add('nkhb-container', {
    label: 'Section Container',
    category: 'Layout',
    content: `<div style="max-width: 1200px; margin: 0 auto; padding: 60px 20px;">
                <p style="text-align: center; color: #999;">컨텐츠를 여기에 넣으세요</p>
              </div>`,
  });

  bm.add('nkhb-grid-2', {
    label: '2 Columns',
    category: 'Layout',
    content: `<div style="display: flex; flex-wrap: wrap; gap: 30px; padding: 20px;">
                <div style="flex: 1; min-width: 300px;">Column 1</div>
                <div style="flex: 1; min-width: 300px;">Column 2</div>
              </div>`,
  });

  bm.add('nkhb-grid-3', {
    label: '3 Columns',
    category: 'Layout',
    content: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; padding: 20px;">
                <div style="padding: 20px; background: #f8fafc; border-radius: 10px;">Item 1</div>
                <div style="padding: 20px; background: #f8fafc; border-radius: 10px;">Item 2</div>
                <div style="padding: 20px; background: #f8fafc; border-radius: 10px;">Item 3</div>
              </div>`,
  });

  // --- Category: Sections ---
  bm.add('nkhb-hero-modern', {
    label: 'Modern Hero',
    category: 'Sections',
    content: `
      <section style="background: linear-gradient(rgba(10,25,47,0.8), rgba(10,25,47,0.8)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80') center/cover; padding: 120px 20px; color: white; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 3.5rem; font-weight: 800; margin-bottom: 25px; line-height: 1.2;">세상을 변화시키는 목소리</h1>
          <p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 45px; line-height: 1.6;">진실과 희망의 메시지를 북한 전역으로 전달하여 자유와 회복을 꿈꾸게 합니다.</p>
          <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
            <a href="#" style="background: #2563eb; color: white; padding: 16px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; transition: all 0.3s;">지금 시작하기</a>
            <a href="#" style="border: 2px solid white; color: white; padding: 16px 40px; border-radius: 12px; font-weight: 700; text-decoration: none; transition: all 0.3s;">더 알아보기</a>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-features', {
    label: 'Features Grid',
    category: 'Sections',
    content: `
      <section style="padding: 100px 20px; background: #ffffff;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 70px;">
            <span style="color: #2563eb; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;">What We Do</span>
            <h2 style="font-size: 2.8rem; font-weight: 800; color: #0f172a; margin-top: 10px;">주요 사역 안내</h2>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 35px;">
            <div style="background: #f8fafc; padding: 50px 40px; border-radius: 24px; transition: transform 0.3s;">
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
    label: 'Image & Text Overlap',
    category: 'Sections',
    content: `
      <section style="padding: 100px 20px; overflow: hidden;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 60px;">
          <div style="flex: 1; min-width: 400px; position: relative;">
            <div style="position: absolute; top: -30px; left: -30px; width: 200px; height: 200px; background: #dbeafe; border-radius: 40px; z-index: -1;"></div>
            <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80" style="width: 100%; border-radius: 40px; box-shadow: 0 30px 60px rgba(0,0,0,0.15);" />
            <div style="position: absolute; bottom: 30px; right: -20px; background: #2563eb; color: white; padding: 25px; border-radius: 20px; box-shadow: 0 15px 30px rgba(37,99,235,0.3);">
              <p style="font-size: 1.5rem; font-weight: 800; margin: 0;">44%</p>
              <p style="font-size: 0.8rem; font-weight: 600; margin: 0; opacity: 0.8;">라디오 청취 경험</p>
            </div>
          </div>
          <div style="flex: 1; min-width: 400px;">
            <h2 style="font-size: 2.8rem; font-weight: 800; color: #1e293b; line-height: 1.2; margin-bottom: 30px;">당신의 관심이 <br/><span style="color: #2563eb;">기적</span>이 됩니다</h2>
            <p style="color: #64748b; font-size: 1.1rem; line-height: 1.8; margin-bottom: 35px;">우리는 보이지 않는 곳에서 변화를 만들어가고 있습니다. 라디오 한 대가 전달하는 소리는 한 사람의 일생을 바꾸는 거대한 울림이 됩니다.</p>
            <ul style="list-style: none; padding: 0; margin-bottom: 40px;">
              <li style="display: flex; items-center; gap: 15px; margin-bottom: 15px;">
                <span style="color: #2563eb; font-weight: 900;">✓</span> <span style="color: #475569; font-weight: 600;">24시간 끊임없는 방송 제작</span>
              </li>
              <li style="display: flex; items-center; gap: 15px; margin-bottom: 15px;">
                <span style="color: #2563eb; font-weight: 900;">✓</span> <span style="color: #475569; font-weight: 600;">전문 탈북민 방송 요원 참여</span>
              </li>
            </ul>
            <a href="#" style="display: inline-block; padding: 14px 35px; background: #1e293b; color: white; border-radius: 14px; text-decoration: none; font-weight: 700; transition: 0.3s;">캠페인 참여하기</a>
          </div>
        </div>
      </section>
    `,
  });

  // --- Category: Forms ---
  bm.add('nkhb-form-group', {
    label: 'Contact Form',
    category: 'Forms',
    content: `
      <form style="max-width: 600px; margin: 0 auto; padding: 50px; background: white; border-radius: 30px; shadow: 0 20px 50px rgba(0,0,0,0.05); border: 1px solid #f1f5f9;">
        <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 30px; text-align: center;">문의하기</h3>
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #64748b; margin-bottom: 8px;">이름</label>
          <input type="text" style="width: 100%; padding: 12px 18px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; transition: 0.3s;" placeholder="이름을 입력하세요" />
        </div>
        <div style="margin-bottom: 20px;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #64748b; margin-bottom: 8px;">이메일</label>
          <input type="email" style="width: 100%; padding: 12px 18px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none;" placeholder="example@email.com" />
        </div>
        <div style="margin-bottom: 30px;">
          <label style="display: block; font-size: 0.85rem; font-weight: 700; color: #64748b; margin-bottom: 8px;">메시지</label>
          <textarea style="width: 100%; padding: 12px 18px; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; min-height: 120px;" placeholder="문의 내용을 입력하세요"></textarea>
        </div>
        <button type="submit" style="width: 100%; padding: 15px; background: #2563eb; color: white; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; transition: 0.3s;">보내기</button>
      </form>
    `,
  });

  bm.add('nkhb-input', {
    label: 'Custom Input',
    category: 'Forms',
    content: `<input type="text" style="padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd; width: 100%;" placeholder="입력하세요..." />`,
  });

  bm.add('nkhb-select', {
    label: 'Custom Select',
    category: 'Forms',
    content: `
      <select style="padding: 10px 15px; border-radius: 8px; border: 1px solid #ddd; width: 100%; background: white;">
        <option>옵션 1</option>
        <option>옵션 2</option>
        <option>옵션 3</option>
      </select>
    `,
  });

  // --- Category: Elements ---
  bm.add('nkhb-stat-card', {
    label: 'Stat Card',
    category: 'Elements',
    content: `
      <div style="padding: 30px; background: #f8fafc; border-radius: 20px; text-align: center; border: 1px solid #e2e8f0;">
        <p style="font-size: 2.5rem; font-weight: 900; color: #2563eb; margin: 0;">1,200+</p>
        <p style="font-size: 0.9rem; color: #64748b; font-weight: 700; margin-top: 5px;">누적 방송 시간</p>
      </div>
    `,
  });

  bm.add('nkhb-card-icon', {
    label: 'Icon Card',
    category: 'Elements',
    content: `
      <div style="padding: 40px; background: white; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; border: 1px solid #f1f5f9;">
        <div style="font-size: 32px; margin-bottom: 20px;">💡</div>
        <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 15px;">새로운 아이디어</h4>
        <p style="color: #64748b; font-size: 0.95rem; line-height: 1.6;">창의적인 방법으로 북한 주민들에게 다가갑니다.</p>
      </div>
    `,
  });

  bm.add('nkhb-video-pro', {
    label: 'Modern Video',
    category: 'Elements',
    content: `
      <div style="max-width: 800px; margin: 0 auto;">
        <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
          <iframe 
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            allowfullscreen>
          </iframe>
        </div>
      </div>
    `,
  });

  bm.add('nkhb-badge', {
    label: 'Badge / Tag',
    category: 'Elements',
    content: `<span style="display: inline-block; padding: 5px 12px; background: #dbeafe; color: #2563eb; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">NKHB 사역</span>`,
  });

  // --- Category: Profiles ---
  bm.add('nkhb-founder-v2', {
    label: 'Founder Profile V2',
    category: 'Profiles',
    content: `
      <section style="padding: 100px 20px; background: linear-gradient(to bottom right, #ffffff, #f8fafc);">
        <div style="max-width: 1100px; margin: 0 auto;">
          <div style="display: flex; flex-wrap: wrap; gap: 60px; align-items: stretch;">
            <div style="flex: 1; min-width: 350px;">
              <div style="height: 100%; border-radius: 40px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.12);">
                <img src="/images/kenneth-bae.png" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
            <div style="flex: 1.2; min-width: 350px; display: flex; flex-direction: column; justify-content: center;">
              <span style="color: #2563eb; font-weight: 800; font-size: 0.9rem; letter-spacing: 3px; text-transform: uppercase;">Founder & Representative</span>
              <h2 style="font-size: 3rem; font-weight: 900; color: #0f172a; margin: 15px 0 30px;">Kenneth Bae</h2>
              <div style="width: 60px; height: 5px; background: #2563eb; margin-bottom: 35px; border-radius: 10px;"></div>
              <p style="font-size: 1.3rem; color: #334155; line-height: 1.6; font-style: italic; margin-bottom: 30px; font-family: serif;">"진리가 너희를 자유케 하리니"</p>
              <p style="color: #64748b; line-height: 1.9; font-size: 1.1rem; margin-bottom: 40px;">735일간의 억류 기간 동안 경험한 하나님의 사랑과 희망을 북한 주민들에게 전하는 것이 저의 소명입니다.</p>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div style="padding: 20px; background: white; border-radius: 20px; border: 1px solid #f1f5f9; shadow: 0 4px 6px rgba(0,0,0,0.02);">
                  <p style="font-weight: 800; color: #1e293b; margin: 0;">2016년</p>
                  <p style="font-size: 0.85rem; color: #64748b; margin-top: 5px;">NKFI 설립</p>
                </div>
                <div style="padding: 20px; background: white; border-radius: 20px; border: 1px solid #f1f5f9;">
                  <p style="font-weight: 800; color: #1e293b; margin: 0;">400+ 통</p>
                  <p style="font-size: 0.85rem; color: #64748b; margin-top: 5px;">억류 중 받은 편지</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `,
  });
};
