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

    // --- Custom UI Panels ---
    const pn = editor.Panels;
    
    // Add Devices Panel
    pn.addPanel({
      id: 'devices-c',
      el: '.panel__devices',
    });

    pn.addButton('devices-c', [
      {
        id: 'device-desktop',
        label: '🖥️',
        command: (editor: any) => editor.setDevice('Desktop'),
        active: true,
        attributes: { title: '데스크탑' },
      },
      {
        id: 'device-tablet',
        label: '📱',
        command: (editor: any) => editor.setDevice('Tablet'),
        attributes: { title: '태블릿' },
      },
      {
        id: 'device-mobile',
        label: '📲',
        command: (editor: any) => editor.setDevice('Mobile'),
        attributes: { title: '모바일' },
      },
    ]);

    // Add Action Buttons to Options Panel
    const optionsPanel = pn.getPanel('options');
    if (optionsPanel) {
        pn.addButton('options', [
            {
                id: 'undo',
                className: 'fa fa-undo',
                command: 'core:undo',
                attributes: { title: '되돌리기 (Ctrl+Z)' }
            },
            {
                id: 'redo',
                className: 'fa fa-redo',
                command: 'core:redo',
                attributes: { title: '다시실행 (Ctrl+Y)' }
            },
            {
                id: 'clean-all',
                className: 'fa fa-trash',
                command: (editor: any) => {
                    if (confirm('전체 내용을 삭제하시겠습니까?')) editor.runCommand('core:canvas-clear');
                },
                attributes: { title: '전체 삭제' }
            }
        ]);
    }

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

    // Load initial data - use loadProjectData for full state restoration
    if (initialData) {
      if (initialData.pages || initialData.assets) {
        // New GrapesJS ProjectData format
        editor.loadProjectData(initialData);
      } else if (initialData.components) {
        // Old partial format compatibility
        editor.setComponents(initialData.components);
        if (initialData.style) editor.setStyle(initialData.style);
      } else {
        // Default template for new/empty pages
        editor.addComponents(`
          <section style="padding: 100px 20px; text-align: center; font-family: 'Pretendard', sans-serif; background: #f8fafc;">
            <h1 style="font-size: 2.5rem; color: #1e293b; margin-bottom: 20px;">새로운 페이지 디자인을 시작하세요</h1>
            <p style="color: #64748b; font-size: 1.1rem; max-width: 600px; margin: 0 auto 40px;">오른쪽 사이드바의 '섹션' 카테고리에서 미리 만들어진 블록들을 드래그하여 페이지를 빠르게 구성할 수 있습니다.</p>
            <div style="display: inline-block; padding: 12px 30px; background: #2563eb; color: white; border-radius: 10px; font-weight: 700;">시작하기</div>
          </section>
        `);
      }
    } else {
      // No initial data at all
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
    <div className="absolute inset-0 bg-white overflow-hidden flex flex-col">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      {/* Custom Top Panel */}
      <div className="h-10 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 shrink-0">
        <div className="panel__devices flex items-center"></div>
        <div className="flex-1 flex justify-center">
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Live Design Studio
            </div>
        </div>
        <div className="panel__basic-actions flex items-center"></div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        <div ref={editorRef} className="h-full w-full"></div>
      </div>

      <style>{`
        .gjs-editor-cont {
            height: 100% !important;
        }
        .gjs-cv-canvas {
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
        }
        .gjs-editor {
          background-color: #fff;
        }
        
        /* Panel Styling */
        .gjs-pn-panels {
            position: relative;
        }
        .gjs-pn-commands {
            display: none; /* Hide default sidebar panels to use our layout */
        }
        .gjs-pn-options {
            padding: 0;
            background: transparent;
            box-shadow: none;
            position: relative;
            right: 0;
            top: 0;
        }
        .gjs-pn-options .gjs-pn-buttons {
            display: flex;
            gap: 5px;
        }
        .gjs-pn-btn {
            border-radius: 8px !important;
            padding: 8px !important;
            transition: all 0.2s;
            color: #64748b !important;
        }
        .gjs-pn-btn:hover {
            background-color: #f1f5f9 !important;
            color: #2563eb !important;
        }
        .gjs-pn-active {
            background-color: #eff6ff !important;
            color: #2563eb !important;
            box-shadow: none !important;
        }

        .panel__devices {
            background: #f1f5f9;
            padding: 3px;
            border-radius: 10px;
            display: flex;
            gap: 2px;
        }
        .panel__devices .gjs-pn-btn {
            padding: 5px 12px !important;
            font-size: 14px;
        }

        .gjs-pn-views-container {
          width: 280px !important;
          border-left: 1px solid #e2e8f0;
          padding: 10px;
          background: #fff;
        }
        .gjs-cv-canvas {
            width: calc(100% - 280px) !important;
        }

        /* Custom Scrollbar */
        .gjs-pn-views-container::-webkit-scrollbar {
          width: 4px;
        }
        .gjs-pn-views-container::-webkit-scrollbar-thumb {
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
      `}</style>
    </div>
  );
};

export default GrapesEditor;
