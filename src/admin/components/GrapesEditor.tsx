import { useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import webpagePreset from 'grapesjs-preset-webpage';

interface GrapesEditorProps {
  initialData: any;
  onChange: (data: { html: string; css: string; components: any; style: any }) => void;
  minHeight?: string;
}

const GrapesEditor = ({ initialData, onChange, minHeight = '600px' }: GrapesEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const grapesInstance = useRef<any>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Clean up previous instance if any
    if (grapesInstance.current) {
      grapesInstance.current.destroy();
    }

    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: true,
      height: minHeight,
      width: 'auto',
      storageManager: false,
      plugins: [webpagePreset],
      pluginsOpts: {
        [webpagePreset as any]: {
          // Custom options for webpage preset
        }
      },
      canvas: {
        styles: [
          'https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css',
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        ]
      }
    });

    // Load initial data if exists
    if (initialData && initialData.components) {
      editor.setComponents(initialData.components);
      editor.setStyle(initialData.style);
    }

    // Set up change tracking
    editor.on('component:update', () => {
      onChange({
        html: editor.getHtml() || '',
        css: editor.getCss() || '',
        components: editor.getComponents(),
        style: editor.getStyle()
      });
    });

    grapesInstance.current = editor;

    return () => {
      if (grapesInstance.current) {
        grapesInstance.current.destroy();
      }
    };
  }, [initialData]); // Re-init on data change might be heavy, but necessary for slug switching

  return (
    <div className="grapes-editor-container border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div ref={editorRef}></div>
    </div>
  );
};

export default GrapesEditor;
