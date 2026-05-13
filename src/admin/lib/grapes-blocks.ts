import type { Editor } from 'grapesjs';

export const initNKHBBlocks = (editor: Editor) => {
  const bm = editor.BlockManager;

  // --- Category: Basic Layout ---
  bm.add('nkhb-container', {
    label: 'Container',
    category: 'Layout',
    content: `<div style="max-width: 1200px; margin: 0 auto; padding: 50px 20px;">
                <p style="text-align: center; color: #999;">컨테이너 (내용을 여기에 넣으세요)</p>
              </div>`,
    attributes: { class: 'gjs-fonts gjs-f-b1' }
  });

  bm.add('nkhb-grid-2', {
    label: '2 Columns',
    category: 'Layout',
    content: `<div style="display: flex; flex-wrap: wrap; gap: 20px; padding: 20px;">
                <div style="flex: 1; min-width: 300px; padding: 20px; border: 1px dashed #ddd;">Column 1</div>
                <div style="flex: 1; min-width: 300px; padding: 20px; border: 1px dashed #ddd;">Column 2</div>
              </div>`,
  });

  // --- Category: Sections ---
  bm.add('nkhb-hero-modern', {
    label: 'Modern Hero',
    category: 'Sections',
    content: `
      <section style="background: linear-gradient(rgba(10,25,47,0.8), rgba(10,25,47,0.8)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80') center/cover; padding: 120px 20px; color: white; text-align: center;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 3rem; font-weight: 800; margin-bottom: 20px; line-height: 1.2;">세상을 변화시키는 목소리</h1>
          <p style="font-size: 1.2rem; opacity: 0.9; margin-bottom: 40px;">진실과 희망의 메시지를 북한 전역으로 전달합니다.</p>
          <div style="display: flex; gap: 15px; justify-content: center;">
            <a href="#" style="background: #2563eb; color: white; padding: 15px 35px; border-radius: 50px; font-weight: 700; text-decoration: none;">지금 시작하기</a>
            <a href="#" style="border: 2px solid white; color: white; padding: 15px 35px; border-radius: 50px; font-weight: 700; text-decoration: none;">더 알아보기</a>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-features', {
    label: 'Features Grid',
    category: 'Sections',
    content: `
      <section style="padding: 80px 20px; background: #f8fafc;">
        <div style="max-width: 1200px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 60px;">
            <h2 style="font-size: 2.5rem; font-weight: 700; color: #1e293b;">주요 사역 안내</h2>
            <p style="color: #64748b;">NKFI와 함께하는 다양한 활동들입니다.</p>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
            <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center;">
              <div style="width: 60px; height: 60px; background: #dbeafe; color: #2563eb; border-radius: 15px; display: flex; items-center; justify-content: center; margin: 0 auto 20px; font-size: 24px;">📢</div>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 15px;">라디오 방송</h3>
              <p style="color: #64748b; line-height: 1.6;">북한 전역으로 희망의 전파를 송출합니다.</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center;">
              <div style="width: 60px; height: 60px; background: #fef2f2; color: #ef4444; border-radius: 15px; display: flex; items-center; justify-content: center; margin: 0 auto 20px; font-size: 24px;">❤️</div>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 15px;">탈북민 지원</h3>
              <p style="color: #64748b; line-height: 1.6;">난민들의 안전한 정착과 회복을 돕습니다.</p>
            </div>
            <div style="background: white; padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center;">
              <div style="width: 60px; height: 60px; background: #f0fdf4; color: #22c55e; border-radius: 15px; display: flex; items-center; justify-content: center; margin: 0 auto 20px; font-size: 24px;">🤝</div>
              <h3 style="font-size: 1.5rem; font-weight: 700; margin-bottom: 15px;">글로벌 네트워크</h3>
              <p style="color: #64748b; line-height: 1.6;">전 세계 파트너들과 협력하여 통일을 준비합니다.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-image-text', {
    label: 'Image & Text',
    category: 'Sections',
    content: `
      <section style="padding: 80px 20px;">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; items-center; gap: 50px;">
          <div style="flex: 1; min-width: 350px;">
            <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80" style="width: 100%; border-radius: 30px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />
          </div>
          <div style="flex: 1; min-width: 350px;">
            <span style="color: #2563eb; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-size: 0.8rem;">Our Mission</span>
            <h2 style="font-size: 2.5rem; font-weight: 700; margin: 15px 0 25px; color: #1e293b;">잊혀진 사람들을 향한 따뜻한 관심</h2>
            <p style="color: #64748b; line-height: 1.8; margin-bottom: 30px;">우리는 북한 주민들이 결코 잊혀지지 않았음을 알리고자 합니다. 한 사람의 관심이 모여 수천 명의 생명을 살리는 기적을 만듭니다. 여러분의 동참이 필요합니다.</p>
            <a href="#" style="display: inline-block; padding: 12px 30px; background: #1e293b; color: white; border-radius: 12px; text-decoration: none; font-weight: 600;">자세히 보기</a>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-cta-dark', {
    label: 'CTA Banner',
    category: 'Sections',
    content: `
      <section style="padding: 60px 20px; background: #2563eb; color: white; text-align: center;">
        <div style="max-width: 900px; margin: 0 auto; display: flex; flex-wrap: wrap; items-center; justify-content: space-between; gap: 30px;">
          <div style="text-align: left; flex: 1; min-width: 300px;">
            <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 10px;">함께 희망을 전해 주세요</h2>
            <p style="opacity: 0.9;">여러분의 후원이 북한 주민의 삶을 변화시킵니다.</p>
          </div>
          <a href="/#support" style="background: white; color: #2563eb; padding: 18px 45px; border-radius: 15px; font-weight: 800; text-decoration: none; font-size: 1.1rem; box-shadow: 0 10px 20px rgba(0,0,0,0.1);">지금 후원하기</a>
        </div>
      </section>
    `,
  });

  // --- Category: Elements ---
  bm.add('nkhb-button-fancy', {
    label: 'Special Button',
    category: 'Elements',
    content: `<a href="#" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; border-radius: 50px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);">클릭하세요</a>`,
  });

  bm.add('nkhb-quote', {
    label: 'Testimonial/Quote',
    category: 'Elements',
    content: `
      <div style="padding: 40px; border-left: 5px solid #2563eb; background: #eff6ff; border-radius: 0 20px 20px 0; margin: 20px 0;">
        <p style="font-style: italic; font-size: 1.2rem; color: #1e40af; line-height: 1.6; margin-bottom: 15px;">"라디오에서 들려오는 희망의 소리가 저를 버티게 한 유일한 힘이었습니다."</p>
        <p style="font-weight: 700; color: #1e293b;">- 어느 청취자의 편지 중에서</p>
      </div>
    `,
  });

  bm.add('nkhb-video', {
    label: 'Video Embed',
    category: 'Elements',
    content: `
      <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
        <iframe 
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      </div>
    `,
  });

  bm.add('nkhb-divider', {
    label: 'Divider',
    category: 'Elements',
    content: `<hr style="border: 0; height: 1px; background: linear-gradient(to right, transparent, #e2e8f0, transparent); margin: 50px 0;" />`,
  });

  // --- Category: Profiles ---
  bm.add('nkhb-founder', {
    label: 'Founder Profile',
    category: 'Profiles',
    content: `
      <section style="padding: 80px 20px; background: white;">
        <div style="max-width: 1000px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 40px; align-items: center;">
          <div style="flex: 1; min-width: 300px; text-align: center;">
            <img src="/images/kenneth-bae.png" style="width: 280px; height: 280px; border-radius: 30px; object-fit: cover; box-shadow: 0 20px 40px rgba(0,0,0,0.1);" />
            <p style="margin-top: 20px; font-weight: 700; color: #1e293b;">Kenneth Bae | NKFI 대표</p>
          </div>
          <div style="flex: 2; min-width: 350px;">
            <h2 style="font-size: 2rem; font-weight: 700; margin-bottom: 20px; color: #2563eb;">설립자 메시지</h2>
            <h3 style="font-size: 1.3rem; font-weight: 600; margin-bottom: 25px; color: #1e293b;">735일간의 북한 억류, 그리고 그 이후의 사명</h3>
            <div style="color: #64748b; line-height: 1.8; space-y: 15px;">
              <p>“우리는 북한 주민들이 결코 잊혀지지 않았음을 알리고자 합니다. 한 사람의 관심이 모여 수천 명의 생명을 살리는 기적을 만듭니다.”</p>
              <p style="margin-top: 15px;">NKFI는 잊혀져가고 소외된 탈북 난민들을 돕고, 다가올 통일 한국을 준비하기 위해 시작되었습니다.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  });

  // --- Category: Information ---
  bm.add('nkhb-faq', {
    label: 'Simple FAQ',
    category: 'Information',
    content: `
      <section style="padding: 80px 20px; background: #f1f5f9;">
        <div style="max-width: 800px; margin: 0 auto;">
          <h2 style="text-align: center; font-size: 2rem; font-weight: 700; margin-bottom: 50px;">자주 묻는 질문</h2>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
              <h4 style="font-weight: 700; margin-bottom: 10px; color: #2563eb;">Q. 후원금은 어떻게 사용되나요?</h4>
              <p style="color: #64748b; font-size: 0.95rem;">대북 라디오 방송 제작 및 송출, 탈북민 구호 활동에 투명하게 사용됩니다.</p>
            </div>
            <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
              <h4 style="font-weight: 700; margin-bottom: 10px; color: #2563eb;">Q. 봉사활동에 참여할 수 있나요?</h4>
              <p style="color: #64748b; font-size: 0.95rem;">네, 번역 및 콘텐츠 제작 등 다양한 분야에서 동역자를 기다리고 있습니다.</p>
            </div>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-contact', {
    label: 'Contact Info',
    category: 'Information',
    content: `
      <section style="padding: 60px 20px; background: #1e293b; color: white;">
        <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; text-align: center;">
          <div>
            <div style="font-size: 30px; margin-bottom: 15px;">📍</div>
            <h4 style="font-weight: 700; margin-bottom: 10px;">주소</h4>
            <p style="opacity: 0.7; font-size: 0.9rem;">서울특별시 마포구... (사무실 주소)</p>
          </div>
          <div>
            <div style="font-size: 30px; margin-bottom: 15px;">📧</div>
            <h4 style="font-weight: 700; margin-bottom: 10px;">이메일</h4>
            <p style="opacity: 0.7; font-size: 0.9rem;">nkhb316@gmail.com</p>
          </div>
          <div>
            <div style="font-size: 30px; margin-bottom: 15px;">📞</div>
            <h4 style="font-weight: 700; margin-bottom: 10px;">연락처</h4>
            <p style="opacity: 0.7; font-size: 0.9rem;">02-1234-5678</p>
          </div>
        </div>
      </section>
    `,
  });

  bm.add('nkhb-audio-list', {
    label: 'Audio Track List',
    category: 'Information',
    content: `
      <section style="padding: 60px 20px; background: white;">
        <div style="max-width: 800px; margin: 0 auto; border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
          <div style="padding: 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 20px;">📻</span>
            <h4 style="font-weight: 700; color: #1e293b; margin: 0;">방송 다시듣기 목록</h4>
          </div>
          <div style="padding: 10px 0;">
            <div style="padding: 15px 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 0.9rem; color: #475569; font-weight: 500;">희망의 편지 - 2026.05.10</span>
              <button style="padding: 5px 15px; background: #2563eb; color: white; border-radius: 50px; font-size: 0.8rem; border: none; cursor: pointer;">듣기</button>
            </div>
            <div style="padding: 15px 25px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9;">
              <span style="font-size: 0.9rem; color: #475569; font-weight: 500;">진리의 말씀 - 2026.05.08</span>
              <button style="padding: 5px 15px; background: #2563eb; color: white; border-radius: 50px; font-size: 0.8rem; border: none; cursor: pointer;">듣기</button>
            </div>
            <div style="padding: 15px 25px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.9rem; color: #475569; font-weight: 500;">마음의 쉼표 - 2026.05.06</span>
              <button style="padding: 5px 15px; background: #2563eb; color: white; border-radius: 50px; font-size: 0.8rem; border: none; cursor: pointer;">듣기</button>
            </div>
          </div>
        </div>
      </section>
    `,
  });
};
