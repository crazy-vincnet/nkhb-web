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

    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: true,
      height: '100%',
      width: '100%',
      storageManager: false,
      plugins: [webpagePreset],
      i18n: {
        locale: 'ko',
        messages: { ko: grapesKo },
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
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        
        uploadBtn.onclick = () => fileInput.click();
        
        fileInput.onchange = async (e: any) => {
          const file = e.target.files?.[0];
          if (!file) return;
          
          try {
            uploadBtn.innerHTML = '업로드 중...';
            uploadBtn.disabled = true;
            
            const fileExt = file.name.split('.').pop();
            const fileName = `cms/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
              .from('assets')
              .upload(fileName, file);
              
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage
              .from('assets')
              .getPublicUrl(fileName);
              
            editor.AssetManager.add(publicUrl);
            uploadBtn.innerHTML = '업로드 완료!';
            setTimeout(() => {
              uploadBtn.innerHTML = '새 이미지 업로드 (Supabase)';
              uploadBtn.disabled = false;
            }, 2000);
          } catch (err: any) {
            alert('업로드 실패: ' + err.message);
            uploadBtn.innerHTML = '다시 시도';
            uploadBtn.disabled = false;
          }
        };
        
        modalContent.prepend(fileInput);
        modalContent.prepend(uploadBtn);
      }
    });

    // Initialize Custom NKHB Blocks
    initNKHBBlocks(editor);

    // Load initial data
    if (initialData && initialData.components && initialData.components.length > 0) {
      editor.setComponents(initialData.components);
      editor.setStyle(initialData.style || '');
    } else {
      editor.addComponents(`
        <section style="padding: 100px 20px; text-align: center; font-family: 'Pretendard', sans-serif; background: #f8fafc;">
          <h1 style="font-size: 2.5rem; color: #1e293b; margin-bottom: 20px;">새로운 페이지 디자인을 시작하세요</h1>
          <p style="color: #64748b; font-size: 1.1rem; max-width: 600px; margin: 0 auto 40px;">오른쪽 사이드바의 '섹션' 카테고리에서 미리 만들어진 블록들을 드래그하여 페이지를 빠르게 구성할 수 있습니다.</p>
          <div style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; border-radius: 10px; font-weight: 700;">시작하기</div>
        </section>
      `);
    }

    editor.Panels.getPanels().forEach((p: any) => p.set('visible', true));

    grapesInstance.current = editor;
    onReady(editor);

    // Force a resize check to prevent cut-off
    setTimeout(() => {
      editor.refresh();
    }, 100);

    return () => {
      if (grapesInstance.current) {
        grapesInstance.current.destroy();
        grapesInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 bg-white overflow-hidden">
      <style>{`
        .gjs-cv-canvas {
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
        }
        .gjs-editor {
          background-color: #fff;
          height: 100% !important;
        }
        .gjs-pn-panels::-webkit-scrollbar {
          width: 4px;
        }
        .gjs-pn-panels::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .nkhb-upload-btn {
          cursor: pointer;
          background-color: #2563eb !important;
          color: white !important;
          border: none;
          padding: 12px !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          transition: all 0.2s;
        }
        .nkhb-upload-btn:hover {
          background-color: #1d4ed8 !important;
          transform: translateY(-1px);
        }
        .nkhb-upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        /* Ensure the canvas and sidebar are fully visible */
        .gjs-cv-canvas {
            width: calc(100% - 230px) !important;
        }
        .gjs-pn-views-container {
            width: 230px !important;
        }
      `}</style>
      <div ref={editorRef} className="h-full w-full"></div>
    </div>
  );
};

export default GrapesEditor;
