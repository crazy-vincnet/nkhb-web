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

        // Add Device Buttons to top panel
        const pn = editor.Panels;
        pn.addPanel({ id: 'devices-c' });
        pn.addButton('devices-c', [
            { id: 'desktop', command: 'set-device-desktop', className: 'fa fa-desktop', active: true, attributes: { title: '데스크탑' } },
            { id: 'tablet', command: 'set-device-tablet', className: 'fa fa-tablet', attributes: { title: '태블릿' } },
            { id: 'mobile', command: 'set-device-mobile', className: 'fa fa-mobile', attributes: { title: '모바일' } },
        ]);

        editor.Commands.add('set-device-desktop', { run: (ed) => ed.setDevice('Desktop') });
        editor.Commands.add('set-device-tablet', { run: (ed) => ed.setDevice('Tablet') });
        editor.Commands.add('set-device-mobile', { run: (ed) => ed.setDevice('Mobile') });

        // Add Undo/Redo to options panel
        pn.addButton('options', [
            { id: 'undo', command: 'core:undo', className: 'fa fa-undo', attributes: { title: '되돌리기' } },
            { id: 'redo', command: 'core:redo', className: 'fa fa-redo', attributes: { title: '다시실행' } },
        ]);

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

        // Fetch and load existing assets from Supabase
        const loadAssets = async () => {
          try {
            const { data: files, error } = await supabase.storage.from('assets').list('cms');
            if (error) throw error;
            if (files) {
              const assets = files
                .filter(file => file.name !== '.emptyFolderPlaceholder')
                .map(file => {
                  const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(`cms/${file.name}`);
                  return publicUrl;
                });
              editor.AssetManager.add(assets);
            }
          } catch (err) {
            console.error('Failed to load assets:', err);
          }
        };
        loadAssets();

        // Load initial data safely
        if (initialData) {
            if (initialData.pages || initialData.assets) {
                editor.loadProjectData(initialData);
            } else if (initialData.components) {
                editor.setComponents(initialData.components);
                if (initialData.style) editor.setStyle(initialData.style);
            }
        }

        // Show default panels and tools
        pn.getPanels().forEach((p: any) => p.set('visible', true));
        
        grapesInstance.current = editor;
        onReady(editor);

        // Auto-refresh to handle container sizing
        setTimeout(() => editor.refresh(), 200);

    } catch (err) {
        console.error('GrapesJS Init Error:', err);
    }

    return () => {
      if (grapesInstance.current) {
        try {
          grapesInstance.current.destroy();
        } catch (e) {
          console.warn('GrapesJS Destroy Error:', e);
        }
        grapesInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="grapesjs-editor-wrapper">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      <div ref={editorRef} id="gjs"></div>
      <style>{`
        .grapesjs-editor-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: #f1f5f9;
        }

        /* GrapesJS Overrides */
        .gjs-editor-cont {
          height: 100% !important;
          width: 100% !important;
        }

        /* Toolbar/Panels Fix */
        .gjs-pn-panels {
          z-index: 100 !important;
        }

        /* Asset Manager Modal */
        .nkhb-upload-btn {
          cursor: pointer;
          background: #2563eb !important;
          color: #fff !important;
          border: none;
          padding: 12px !important;
          border-radius: 8px !important;
          font-weight: bold !important;
          font-size: 14px !important;
          transition: all 0.2s;
        }
        .nkhb-upload-btn:hover {
          background: #1e40af !important;
        }
        .nkhb-upload-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Korean Translations Style Adjustments */
        .gjs-pn-views-container {
          width: 250px !important;
        }
        .gjs-cv-canvas {
          width: calc(100% - 250px) !important;
        }
      `}</style>
    </div>
  );
};

export default GrapesEditor;