import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Globe,
  ChevronLeft,
  X,
  ExternalLink,
  ImageIcon,
  Layout as LayoutIcon,
  Info
} from 'lucide-react';

interface StyleProps {
  fontSize?: string;
  color?: string;
  backgroundColor?: string;
  margin?: string;
  padding?: string;
  fontWeight?: string;
  borderRadius?: string;
  borderWidth?: string;
  borderColor?: string;
  link?: string;
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
  const navigate = useNavigate();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [computedStyles, setComputedStyles] = useState<StyleProps | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [currentPage, setCurrentPage] = useState<string>('/');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modifiedKeys, setModifiedIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetchContent();
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NKHB_ELEMENT_SELECTED') {
        const { key, computedStyles: cs, link } = event.data;
        setSelectedKey(key);
        setComputedStyles(cs);
        setSidebarOpen(true);
        
        // If the item doesn't have a link yet, we can suggest the one found in DOM
        if (link) {
            setItems(prev => prev.map(i => {
                if (i.key === key && !i.style_props?.link) {
                    return {
                        ...i,
                        style_props: { ...i.style_props, link }
                    };
                }
                return i;
            }));
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase.from('content').select('*');
    if (data) {
        const normalized = data.map(item => ({
            ...item,
            style_props: item.style_props || {}
        }));
        setItems(normalized);
    }
    setLoading(false);
  };

  const selectedItem = items.find(i => i.key === selectedKey);

  const updateItem = (key: string, updates: Partial<ContentItem>) => {
    setItems(prev => prev.map(i => i.key === key ? { ...i, ...updates } : i));
    setModifiedIds(prev => new Set(prev).add(key));

    const item = items.find(i => i.key === key);
    if (!item) return;

    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'NKHB_LIVE_UPDATE',
        key,
        data: {
            text: updates.value_ko ?? updates.value_en ?? (item.value_ko || item.value_en),
            styles: updates.style_props || item.style_props,
            link: (updates.style_props || item.style_props)?.link
        }
      }, '*');
    }
  };

  const handleLanguageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'value_ko' | 'value_en') => {
    const file = e.target.files?.[0];
    if (!file || !selectedKey) return;

    setUploading(true);
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedKey}-${field}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `site-assets/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        updateItem(selectedKey, { [field]: publicUrl });
        alert(`${field === 'value_ko' ? '한국어' : '영어'} 이미지가 업로드되었습니다.`);
    } catch (err: any) {
        alert('업로드 실패: ' + err.message);
    } finally {
        setUploading(false);
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
    } catch (err: any) {
        alert('저장 실패: ' + err.message);
    } finally {
        setSaving(false);
    }
  };

  const isImageKey = selectedKey?.includes('image') || selectedKey?.includes('logo') || selectedKey?.includes('bg');

  if (loading) return <div className="flex items-center justify-center h-screen bg-white"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden font-pretendard">
      <div className="flex-1 flex flex-col relative">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b flex items-center justify-between px-6 z-20 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"><ChevronLeft className="w-6 h-6" /></button>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <div>
                    <h1 className="text-lg font-black text-gray-900 tracking-tighter flex items-center gap-2"><Monitor className="w-5 h-5 text-blue-600" />Visual Editor</h1>
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Full-Screen Workspace</p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <button 
                    onClick={() => setCurrentPage('/')} 
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${currentPage === '/' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <LayoutIcon className="w-3.5 h-3.5" /> HOME
                </button>
                <button 
                    onClick={() => setCurrentPage('/about')} 
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${currentPage === '/about' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Info className="w-3.5 h-3.5" /> ABOUT
                </button>
            </div>

            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Monitor className="w-3.5 h-3.5" /> DESKTOP</button>
                <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Smartphone className="w-3.5 h-3.5" /> MOBILE</button>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={() => window.open('/', '_blank')} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-all"><ExternalLink className="w-5 h-5" /></button>
            </div>
        </header>

        <main className="flex-1 overflow-hidden relative flex items-center justify-center p-0">
            <div className={`transition-all duration-700 ease-in-out shadow-2xl bg-white ${previewMode === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[667px] my-8 rounded-[2rem] border-[8px] border-gray-900 overflow-hidden'}`}>
                <iframe ref={iframeRef} src={currentPage} className="w-full h-full border-none" title="Site Preview" />
            </div>
            {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="absolute right-6 top-20 w-12 h-12 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-30"><Palette className="w-6 h-6" /></button>}
        </main>

        {modifiedKeys.size > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-8 duration-500">
                <div className="bg-gray-900 text-white pl-8 pr-4 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-6 border border-white/10 backdrop-blur-xl">
                    <div className="flex flex-col"><span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Unsaved Changes</span><span className="text-sm font-bold">{modifiedKeys.size} elements modified</span></div>
                    <button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-500 px-8 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}SAVE ALL</button>
                </div>
            </div>
        )}
      </div>

      <aside className={`w-96 bg-white border-l shadow-[-20px_0_50px_rgba(0,0,0,0.05)] transition-all duration-500 z-30 flex flex-col ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute right-0'}`}>
        <div className="p-8 border-b flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Property Editor</h2>
            <button onClick={() => { setSelectedKey(null); setSidebarOpen(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {selectedItem ? (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-6">
                        <label className="text-[11px] font-black text-blue-600 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full w-fit"><Type className="w-3.5 h-3.5" /> TEXT CONTENT</label>
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KOREAN</span>
                                <textarea value={selectedItem.value_ko} onChange={(e) => updateItem(selectedKey!, { value_ko: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none leading-relaxed shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ENGLISH</span>
                                <textarea value={selectedItem.value_en} onChange={(e) => updateItem(selectedKey!, { value_en: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none leading-relaxed shadow-inner" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-indigo-600 flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full w-fit">{isImageKey ? <ImageIcon className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />} {isImageKey ? 'BILINGUAL IMAGE ASSETS' : 'LINK / URL'}</label>
                        {isImageKey ? (
                            <div className="grid grid-cols-1 gap-6">
                                {/* Korean Image */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KOREAN LOGO / IMAGE</span>
                                    <div className="w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative group/img">
                                        {selectedItem.value_ko ? <img src={selectedItem.value_ko} alt="KO Preview" className="max-h-full max-w-full object-contain" /> : <ImageIcon className="text-gray-200 w-12 h-12" />}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className={`bg-white text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer shadow-xl transform translate-y-2 group-hover/img:translate-y-0 transition-transform flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'CHANGE KO IMAGE'}
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLanguageFileUpload(e, 'value_ko')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                {/* English Image */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ENGLISH LOGO / IMAGE</span>
                                    <div className="w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative group/img">
                                        {selectedItem.value_en ? <img src={selectedItem.value_en} alt="EN Preview" className="max-h-full max-w-full object-contain" /> : <ImageIcon className="text-gray-200 w-12 h-12" />}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                            <label className={`bg-white text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer shadow-xl transform translate-y-2 group-hover/img:translate-y-0 transition-transform flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'CHANGE EN IMAGE'}
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleLanguageFileUpload(e, 'value_en')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative group">
                                <input type="text" value={selectedItem.style_props?.link || ''} placeholder="https://... 또는 /path" onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, link: e.target.value } })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 shadow-inner" />
                                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-500" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full w-fit"><Maximize className="w-3.5 h-3.5" /> SIZE & SPACING</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-400 ml-1">FONT SIZE</span>
                                <input type="text" value={selectedItem.style_props?.fontSize || ''} placeholder={computedStyles?.fontSize} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, fontSize: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-400 ml-1">MARGIN</span>
                                <input type="text" value={selectedItem.style_props?.margin || ''} placeholder={computedStyles?.margin} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, margin: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-rose-600 flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-full w-fit"><Palette className="w-3.5 h-3.5" /> COLORS & BACKGROUND</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-400 ml-1">TEXT COLOR</span>
                                <div className="flex gap-2">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border-4 border-white shadow-lg">
                                        <input type="color" value={selectedItem.style_props?.color?.startsWith('#') ? selectedItem.style_props.color : (computedStyles?.color?.startsWith('#') ? computedStyles.color : '#000000')} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, color: e.target.value } })} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" />
                                    </div>
                                    <input type="text" value={selectedItem.style_props?.color || ''} placeholder={computedStyles?.color} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, color: e.target.value } })} className="flex-1 bg-gray-50 border-none rounded-xl text-[10px] uppercase font-black text-center shadow-inner" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-400 ml-1">BACKGROUND</span>
                                <div className="flex gap-2">
                                    <div className="w-10 h-10 rounded-xl overflow-hidden relative border-4 border-white shadow-lg">
                                        <input type="color" value={selectedItem.style_props?.backgroundColor?.startsWith('#') ? selectedItem.style_props.backgroundColor : (computedStyles?.backgroundColor?.startsWith('#') ? computedStyles.backgroundColor : '#FFFFFF')} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, backgroundColor: e.target.value } })} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" />
                                    </div>
                                    <input type="text" value={selectedItem.style_props?.backgroundColor || ''} placeholder={computedStyles?.backgroundColor || 'Transparent'} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, backgroundColor: e.target.value } })} className="flex-1 bg-gray-50 border-none rounded-xl text-[10px] uppercase font-black text-center shadow-inner" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-black text-amber-600 flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full w-fit"><Maximize className="w-3.5 h-3.5" /> BORDERS & ROUNDING</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-400 ml-1">BORDER RADIUS</span>
                                <input type="text" value={selectedItem.style_props?.borderRadius || ''} placeholder={computedStyles?.borderRadius} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, borderRadius: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" />
                            </div>
                            <div className="space-y-2">
                                <span className="text-[9px] font-black text-gray-400 ml-1">BORDER WIDTH</span>
                                <input type="text" value={selectedItem.style_props?.borderWidth || ''} placeholder={computedStyles?.borderWidth} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, borderWidth: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <span className="text-[9px] font-black text-gray-400 ml-1">BORDER COLOR</span>
                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-xl overflow-hidden relative border-4 border-white shadow-lg">
                                    <input type="color" value={selectedItem.style_props?.borderColor?.startsWith('#') ? selectedItem.style_props.borderColor : (computedStyles?.borderColor?.startsWith('#') ? computedStyles.borderColor : '#000000')} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, borderColor: e.target.value } })} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" />
                                </div>
                                <input type="text" value={selectedItem.style_props?.borderColor || ''} placeholder={computedStyles?.borderColor} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, borderColor: e.target.value } })} className="flex-1 bg-gray-50 border-none rounded-xl text-[10px] uppercase font-black text-center shadow-inner" />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner"><Monitor className="w-10 h-10 text-gray-300" /></div>
                    <div className="space-y-2"><p className="text-base font-black text-gray-900 uppercase tracking-tight">Select an Element</p><p className="text-xs text-gray-400 px-8 leading-relaxed font-medium">Click on any text or button in the preview window to start editing its properties.</p></div>
                </div>
            )}
        </div>
      </aside>
    </div>
  );
};

export default Content;
