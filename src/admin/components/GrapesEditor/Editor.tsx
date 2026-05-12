import React, { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor as GjsEditor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { initNKHBBlocks } from './blocks';
import { savePage, CMSPageData } from '../../lib/cms';
import { Save, Globe, Settings } from 'lucide-react';

interface EditorProps {
  initialData: CMSPageData;
  onSave?: () => void;
}

const Editor: React.FC<EditorProps> = ({ initialData, onSave }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<GjsEditor | null>(null);
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [isSaving, setIsSaving] = useState(false);

  // SEO State
  const [seo, setSeo] = useState({
    seo_title_ko: initialData.seo_title_ko || '',
    seo_title_en: initialData.seo_title_en || '',
    seo_description_ko: initialData.seo_description_ko || '',
    seo_description_en: initialData.seo_description_en || '',
    seo_image_url: initialData.seo_image_url || '',
  });

  useEffect(() => {
    if (!editorRef.current) return;

    const e = grapesjs.init({
      container: editorRef.current,
      height: '100%',
      width: 'auto',
      storageManager: false,
      panels: { defaults: [] },
      blockManager: {
        appendTo: '#blocks',
      },
      traitManager: {
        appendTo: '#traits',
      },
      selectorManager: {
        appendTo: '#selectors',
      },
      styleManager: {
        appendTo: '#styles',
      },
      layerManager: {
        appendTo: '#layers',
      },
      deviceManager: {
        devices: [
          { name: 'Desktop', width: '' },
          { name: 'Mobile', width: '320px', widthMedia: '480px' },
        ],
      },
    });

    initNKHBBlocks(e);

    // Load initial content
    if (initialData.layout_json) {
      e.loadProjectData(initialData.layout_json);
    }

    setEditor(e);

    return () => {
      e.destroy();
    };
  }, []);

  useEffect(() => {
    if (!editor) return;

    // Apply language filtering to traits via CSS
    const styleId = 'gjs-trait-lang-filter';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    if (lang === 'ko') {
      styleEl.innerHTML = `
        div[class*="gjs-trait-property-"][class$="_en"] { display: none !important; }
        div[class*="gjs-trait-property-"][class$="_ko"] { display: block !important; }
      `;
    } else {
      styleEl.innerHTML = `
        div[class*="gjs-trait-property-"][class$="_ko"] { display: none !important; }
        div[class*="gjs-trait-property-"][class$="_en"] { display: block !important; }
      `;
    }
  }, [editor, lang]);

  const handleSave = async () => {
    if (!editor) return;
    setIsSaving(true);
    try {
      const layout_json = editor.getProjectData();
      await savePage(initialData.slug, {
        ...seo,
        layout_json,
      });
      alert('Page saved successfully!');
      onSave?.();
    } catch (error) {
      console.error('Failed to save page:', error);
      alert('Failed to save page.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border rounded-lg overflow-hidden shadow-xl">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold capitalize">{initialData.slug} Page</h2>
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setLang('ko')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                lang === 'ko' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              KO
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                lang === 'en' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              EN
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Blocks */}
        <div className="w-64 border-r flex flex-col bg-gray-50 dark:bg-gray-800">
          <div className="p-3 border-b font-medium flex items-center">
            <Settings className="w-4 h-4 mr-2" /> Blocks
          </div>
          <div id="blocks" className="flex-1 overflow-y-auto p-2"></div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 relative bg-gray-200">
          <div ref={editorRef} className="h-full"></div>
        </div>

        {/* Right Sidebar: Traits & SEO */}
        <div className="w-80 border-l flex flex-col bg-gray-50 dark:bg-gray-800">
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-3 border-b font-medium flex items-center">
              <Settings className="w-4 h-4 mr-2" /> Properties
            </div>
            <div id="traits" className="flex-1 overflow-y-auto p-2"></div>
          </div>

          <div className="h-1/2 border-t flex flex-col overflow-hidden">
            <div className="p-3 border-b font-medium flex items-center">
              <Globe className="w-4 h-4 mr-2" /> SEO Settings ({lang.toUpperCase()})
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">SEO Title</label>
                <input
                  type="text"
                  value={lang === 'ko' ? seo.seo_title_ko : seo.seo_title_en}
                  onChange={(e) => setSeo({
                    ...seo,
                    [lang === 'ko' ? 'seo_title_ko' : 'seo_title_en']: e.target.value
                  })}
                  className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">SEO Description</label>
                <textarea
                  rows={3}
                  value={lang === 'ko' ? seo.seo_description_ko : seo.seo_description_en}
                  onChange={(e) => setSeo({
                    ...seo,
                    [lang === 'ko' ? 'seo_description_ko' : 'seo_description_en']: e.target.value
                  })}
                  className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Social Image URL</label>
                <input
                  type="text"
                  value={seo.seo_image_url}
                  onChange={(e) => setSeo({ ...seo, seo_image_url: e.target.value })}
                  className="w-full p-2 text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden GrapesJS UI elements we might need but don't want to show yet */}
      <div id="selectors" className="hidden"></div>
      <div id="styles" className="hidden"></div>
      <div id="layers" className="hidden"></div>
    </div>
  );
};

export default Editor;
