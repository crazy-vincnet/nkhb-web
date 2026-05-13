import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import webpagePreset from 'grapesjs-preset-webpage';

interface GrapesEditorProps {
  initialData: any;
  onChange: (data: { html: string; css: string; components: any; style: any }) => void;
  minHeight?: string;
}

const GrapesEditor = ({ initialData, onChange }: Omit<GrapesEditorProps, 'minHeight'>) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const grapesInstance = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous instance
    if (grapesInstance.current) {
      grapesInstance.current.destroy();
    }

    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: true,
      height: '100%',
      width: 'auto',
      storageManager: false,
      plugins: [webpagePreset],
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ]
      }
    });

    // Handle initialization data
    if (initialData && initialData.components && initialData.components.length > 0) {
      editor.setComponents(initialData.components);
      editor.setStyle(initialData.style || '');
    } else {
      // Add a default welcome section if empty
      editor.addComponents(`
        <section style="padding: 50px; text-align: center; font-family: sans-serif;">
          <h1>새로운 페이지를 디자인해 보세요!</h1>
          <p>오른쪽의 블록들을 이곳으로 드래그하여 내용을 추가할 수 있습니다.</p>
        </section>
      `);
    }

    // Explicitly show panels that might be hidden
    editor.Panels.getPanels().forEach((p: any) => p.set('visible', true));

    // Setup change event
    const handleUpdate = () => {
      onChange({
        html: editor.getHtml() || '',
        css: editor.getCss() || '',
        components: editor.getComponents(),
        style: editor.getStyle()
      });
    };

    editor.on('component:update', handleUpdate);
    editor.on('style:update', handleUpdate);

    grapesInstance.current = editor;

    return () => {
      if (grapesInstance.current) {
        grapesInstance.current.destroy();
      }
    };
  }, [initialData]); // This key-based re-init is handled by the parent's key prop

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
      `}</style>
      <div ref={editorRef} className="h-full"></div>
    </div>
  );
};

export default GrapesEditor;
