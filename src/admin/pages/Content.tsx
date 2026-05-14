import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Type, 
  Link as LinkIcon, 
  Maximize, 
  Palette, 
  Monitor,
  Smartphone,
  Loader2,
  Globe
} from 'lucide-react';

interface StyleProps {
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  [key: string]: any;
}

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
  style_props: StyleProps;
}

const Content = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modifiedKeys, setModifiedIds] = useState<Set<string>>(new Set());
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchContent();
    
    // Listen for element selection from Iframe
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NKHB_ELEMENT_SELECTED') {
        setSelectedKey(event.data.key);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase.from('content').select('*');
    if (data) setItems(data);
    setLoading(false);
  };

  const selectedItem = items.find(i => i.key === selectedKey);

  const updateItem = (key: string, updates: Partial<ContentItem>) => {
    setItems(prev => prev.map(i => i.key === key ? { ...i, ...updates } : i));
    setModifiedIds(prev => new Set(prev).add(key));

    // Send real-time update to iframe
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'NKHB_LIVE_UPDATE',
        key,
        data: {
            text: updates.value_ko || updates.value_en, // Logic for live text
            styles: updates.style_props
        }
      }, '*');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const updates = items.filter(i => modifiedKeys.has(i.key));
    
    try {
        const { error } = await supabase.from('content').upsert(
            updates.map(i => ({
                id: i.id,
                key: i.key,
                value_ko: i.value_ko,
                value_en: i.value_en,
                style_props: i.style_props
            }))
        );
        if (error) throw error;
        setModifiedIds(new Set());
        alert('모든 변경 사항이 저장되었습니다.');
    } catch (e: any) {
        alert('저장 실패: ' + e.message);
    } finally {
        setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden font-pretendard">
      {/* Sidebar: Navigation & Controls */}
      <aside className="w-80 border-r bg-white flex flex-col shrink-0">
        <div className="p-6 border-b">
            <h1 className="text-xl font-black flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-600" />
                Visual Editor
            </h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live Site Customization</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {selectedItem ? (
                <div className="space-y-8 animate-in slide-in-from-left-4 duration-300">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-black text-gray-900 uppercase">Property Editor</h2>
                        <button onClick={() => setSelectedKey(null)} className="text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors underline">닫기</button>
                    </div>

                    {/* 1. TEXT (Priority 1) */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-blue-600 flex items-center gap-2">
                            <Type className="w-3 h-3" /> TEXT CONTENT
                        </label>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">KOREAN</span>
                                <textarea 
                                    value={selectedItem.value_ko}
                                    onChange={(e) => updateItem(selectedKey!, { value_ko: e.target.value })}
                                    className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                                />
                            </div>
                            <div>
                                <span className="text-[9px] font-bold text-gray-400 uppercase ml-1">ENGLISH</span>
                                <textarea 
                                    value={selectedItem.value_en}
                                    onChange={(e) => updateItem(selectedKey!, { value_en: e.target.value })}
                                    className="w-full mt-1 p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. LINK (Priority 2) */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-indigo-600 flex items-center gap-2">
                            <LinkIcon className="w-3 h-3" /> LINK / URL
                        </label>
                        <input 
                            type="text"
                            value={selectedItem.style_props?.link || ''}
                            placeholder="https://... 또는 /path"
                            onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, link: e.target.value } })}
                            className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* 3. SIZE (Priority 3) */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-emerald-600 flex items-center gap-2">
                            <Maximize className="w-3 h-3" /> SIZE & SPACING
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold text-gray-400 ml-1">FONT SIZE</span>
                                <input 
                                    type="text"
                                    value={selectedItem.style_props?.fontSize || ''}
                                    placeholder="e.g. 1.5rem"
                                    onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, fontSize: e.target.value } })}
                                    className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-bold text-gray-400 ml-1">MARGIN</span>
                                <input 
                                    type="text"
                                    value={selectedItem.style_props?.margin || ''}
                                    placeholder="e.g. 10px"
                                    onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, margin: e.target.value } })}
                                    className="w-full p-2 bg-gray-50 border-none rounded-lg text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 4. COLOR (Priority 4) */}
                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-rose-600 flex items-center gap-2">
                            <Palette className="w-3 h-3" /> COLORS
                        </label>
                        <div className="flex gap-4">
                            <div className="flex-1 space-y-1.5">
                                <span className="text-[9px] font-bold text-gray-400 ml-1">TEXT COLOR</span>
                                <div className="flex gap-2">
                                    <input 
                                        type="color"
                                        value={selectedItem.style_props?.color || '#000000'}
                                        onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, color: e.target.value } })}
                                        className="w-8 h-8 rounded-lg cursor-pointer overflow-hidden border-none"
                                    />
                                    <input 
                                        type="text"
                                        value={selectedItem.style_props?.color || ''}
                                        onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, color: e.target.value } })}
                                        className="flex-1 bg-gray-50 border-none rounded-lg text-[10px] uppercase font-bold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 opacity-40">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <Monitor className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-500">편집할 요소를 선택하세요</p>
                        <p className="text-[10px] text-gray-400 mt-1">미리보기 화면에서 파란색 테두리가<br/>생기는 요소를 클릭해 보세요.</p>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Save Area */}
        <div className="p-6 border-t bg-gray-50">
            <button
                onClick={handleSave}
                disabled={modifiedKeys.size === 0 || saving}
                className={`w-full py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
                    modifiedKeys.size > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' 
                    : 'bg-white text-gray-300 border border-gray-100 cursor-not-allowed'
                }`}
            >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {modifiedKeys.size > 0 ? `${modifiedKeys.size}개 변경 사항 저장` : '저장할 내용 없음'}
            </button>
        </div>
      </aside>

      {/* Main Preview Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Device Controls */}
        <div className="h-14 bg-white border-b flex items-center justify-center gap-2 px-6">
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                <button 
                    onClick={() => setPreviewMode('desktop')}
                    className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                    <Monitor className="w-4 h-4" />
                </button>
                <button 
                    onClick={() => setPreviewMode('mobile')}
                    className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}
                >
                    <Smartphone className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 flex justify-center items-center">
                <div className="px-4 py-1.5 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 flex items-center gap-2 border border-gray-100">
                    <Globe className="w-3 h-3" />
                    PREVIEW: HTTPS://NKHB.ORG
                </div>
            </div>
            <div className="w-20"></div>
        </div>

        <div className="flex-1 bg-gray-200 flex items-center justify-center overflow-hidden p-8">
            <div className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden rounded-[1rem] ${
                previewMode === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[667px]'
            }`}>
                <iframe 
                    ref={iframeRef}
                    src="/"
                    className="w-full h-full border-none"
                    title="Site Preview"
                />
            </div>
        </div>
      </main>
    </div>
  );
};

export default Content;
