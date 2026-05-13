import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import webpagePreset from 'grapesjs-preset-webpage';
import { initNKHBBlocks } from '../lib/grapes-blocks';
import { grapesKo } from '../lib/grapes-ko';

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
      width: 'auto',
      storageManager: false,
      plugins: [webpagePreset],
      i18n: {
        locale: 'ko',
        messages: { ko: grapesKo },
      },
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ]
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

    return () => {
      if (grapesInstance.current) {
        grapesInstance.current.destroy();
        grapesInstance.current = null;
      }
    };
  }, []); // Only run once on mount

  return (
    <div className="h-full w-full bg-white">
      <style>{`
        .gjs-cv-canvas {
          width: 100% !important;
          height: 100% !important;
          top: 0 !important;
        }
        .gjs-editor {
          background-color: #fff;
        }
        .gjs-pn-panels::-webkit-scrollbar {
          width: 4px;
        }
        .gjs-pn-panels::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
      `}</style>
      <div ref={editorRef} className="h-full"></div>
    </div>
  );
};

export default GrapesEditor;
