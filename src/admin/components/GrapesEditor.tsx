import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import webpagePreset from 'grapesjs-preset-webpage';
import { initNKHBBlocks } from '../lib/grapes-blocks';
import { grapesKo } from '../lib/grapes-ko';
import { supabase } from '../lib/supabase';

interface GrapesEditorProps {
  initialData: any;
  onReady: (editor: any) => void;
}

const GrapesEditor = ({ initialData, onReady }: GrapesEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const grapesInstance = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current || grapesInstance.current) return;

    try {
        const editor = grapesjs.init({
          container: editorRef.current,
          fromElement: false,
          height: '100%',
          width: '100%',
          storageManager: false,
          plugins: [webpagePreset],
          i18n: {
            locale: 'ko',
            messages: { ko: grapesKo },
          },
          deviceManager: {
            devices: [
              { name: 'Desktop', width: '' },
              { name: 'Tablet', width: '768px', widthMedia: '768px' },
              { name: 'Mobile', width: '375px', widthMedia: '375px' },
            ],
          },
          assetManager: {
            upload: false,
            assets: [],
          },
          canvas: {
            styles: [
              'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
              'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
            ]
          }
        });

        // Add Device Buttons to standard panel
        const panelManager = editor.Panels;
        panelManager.addPanel({ id: 'devices-c' });
        panelManager.addButton('devices-c', [
            { id: 'desktop', command: 'set-device-desktop', className: 'fa fa-desktop', active: true },
            { id: 'tablet', command: 'set-device-tablet', className: 'fa fa-tablet' },
            { id: 'mobile', command: 'set-device-mobile', className: 'fa fa-mobile' },
        ]);

        editor.Commands.add('set-device-desktop', { run: (ed) => ed.setDevice('Desktop') });
        editor.Commands.add('set-device-tablet', { run: (ed) => ed.setDevice('Tablet') });
        editor.Commands.add('set-device-mobile', { run: (ed) => ed.setDevice('Mobile') });

        // Setup Custom Image Upload Bridge to Supabase
        editor.on('run:open-assets', () => {
          const modal = editor.Modal;
          const modalContent = modal.getContentEl();
          if (modalContent && !modalContent.querySelector('.nkhb-upload-btn')) {
            const uploadBtn = document.createElement('button');
            uploadBtn.className = 'nkhb-upload-btn gjs-btn-prim';
            uploadBtn.innerHTML = '새 이미지 업로드 (Supabase)';
            uploadBtn.style.margin = '10px';
            uploadBtn.style.width = 'calc(100% - 20px)';
            const fileInput = document.createElement('input');
            fileInput.type = 'file'; fileInput.accept = 'image/*'; fileInput.style.display = 'none';
            uploadBtn.onclick = () => fileInput.click();
            fileInput.onchange = async (e: any) => {
              const file = e.target.files?.[0]; if (!file) return;
              try {
                uploadBtn.innerHTML = '업로드 중...'; uploadBtn.disabled = true;
                const fileExt = file.name.split('.').pop();
                const fileName = `cms/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage.from('assets').upload(fileName, file);
                if (uploadError) throw uploadError;
                const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName);
                editor.AssetManager.add(publicUrl);
                uploadBtn.innerHTML = '업로드 완료!';
                setTimeout(() => { uploadBtn.innerHTML = '새 이미지 업로드 (Supabase)'; uploadBtn.disabled = false; }, 2000);
              } catch (err: any) {
                alert('업로드 실패: ' + err.message);
                uploadBtn.innerHTML = '다시 시도'; uploadBtn.disabled = false;
              }
            };
            modalContent.prepend(fileInput); modalContent.prepend(uploadBtn);
          }
        });

        initNKHBBlocks(editor);

        if (initialData) {
          if (initialData.pages || initialData.assets) editor.loadProjectData(initialData);
          else if (initialData.components) {
            editor.setComponents(initialData.components);
            if (initialData.style) editor.setStyle(initialData.style);
          } else {
            editor.addComponents('<section style="padding: 100px 20px; text-align: center; font-family: Pretendard; background: #f8fafc;"><h1 style="font-size: 2.5rem; color: #1e293b; margin-bottom: 20px;">새로운 페이지 디자인을 시작하세요</h1><p style="color: #64748b; font-size: 1.1rem; max-width: 600px; margin: 0 auto 40px;">오른쪽 사이드바에서 블록을 드래그하여 페이지를 구성하세요.</p><div style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; border-radius: 10px; font-weight: 700;">시작하기</div></section>');
          }
        } else {
          editor.addComponents('<section style="padding: 100px 20px; text-align: center; font-family: Pretendard; background: #f8fafc;"><h1 style="font-size: 2.5rem; color: #1e293b; margin-bottom: 20px;">새로운 페이지 디자인을 시작하세요</h1><p style="color: #64748b; font-size: 1.1rem; max-width: 600px; margin: 0 auto 40px;">오른쪽 사이드바에서 블록을 드래그하여 페이지를 구성하세요.</p><div style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; border-radius: 10px; font-weight: 700;">시작하기</div></section>');
        }

        grapesInstance.current = editor;
        onReady(editor);
        setTimeout(() => editor.refresh(), 100);
    } catch (err) {
        console.error('GrapesJS Init Error:', err);
    }

    return () => {
      if (grapesInstance.current) {
        grapesInstance.current.destroy();
        grapesInstance.current = null;
      }
    };
  }, [initialData]);

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      <div ref={editorRef} className="h-full w-full"></div>
      <style>{`
        .gjs-editor-cont { height: 100% !important; }
        .gjs-cv-canvas { width: 100% !important; height: 100% !important; top: 0 !important; }
        .gjs-pn-views-container { width: 280px !important; background: #fff; border-left: 1px solid #eee; }
        .gjs-cv-canvas { width: calc(100% - 280px) !important; }
        .nkhb-upload-btn { cursor: pointer; background: #2563eb !important; color: #fff !important; border: none; padding: 12px !important; border-radius: 8px !important; font-weight: bold !important; }
        .gjs-pn-panels { border-bottom: 1px solid #eee; }
        .gjs-pn-active { color: #2563eb !important; background: transparent !important; }
      `}</style>
    </div>
  );
};

export default GrapesEditor;
