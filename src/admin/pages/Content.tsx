import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Save, Type, Link as LinkIcon, Maximize, Palette, Smartphone, Monitor, RotateCcw, RotateCw, Loader2, X, Image as ImageIcon, ChevronLeft, Info, Layout as LayoutIcon, GripVertical, Globe, Languages, AlertCircle
} from 'lucide-react';
import { useHistory } from '../lib/useHistory';
import { optimizeImage } from '../lib/imageOptimizer';
import { translateText } from '../lib/translation';
import { HOME_DEFAULT_LAYOUT, ABOUT_DEFAULT_LAYOUT } from '../../public/lib/registry';

interface StyleProps {
  fontSize?: string; color?: string; backgroundColor?: string; margin?: string; padding?: string; fontWeight?: string; borderRadius?: string; borderWidth?: string; borderColor?: string; width?: string; height?: string; link?: string; mobile?: Partial<StyleProps>; [key: string]: any;
}

interface ContentItem { id: string; key: string; value_ko: string; value_en: string; style_props: StyleProps; }

const SECTION_LABELS: Record<string, string> = {
    'section_hero': 'Hero Section', 'section_background': 'Background Section', 'section_composition': 'Composition Section', 'section_effects': 'Effects Section', 'section_reach': 'Reach Section', 'section_guide': 'Guide Section', 'section_support': 'Support Section', 'section_about_hero': 'About Hero', 'section_about_intro': 'About Intro', 'section_about_vision': 'About Vision', 'section_about_ministry': 'About Ministry', 'section_about_founder': 'About Founder', 'section_about_cta': 'About CTA'
};

const Content = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [computedStyles, setComputedStyles] = useState<StyleProps | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [currentPage, setCurrentPage] = useState<string>('/');
  const [editorLang, setEditorLang] = useState<'ko' | 'en'>('ko');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean | string>(false);
  const [modifiedKeys, setModifiedIds] = useState<Set<string>>(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'properties' | 'structure' | 'theme' | 'audit'>('properties');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [themeSettings, setThemeSettings] = useState({
    colors: { accent: '#2563eb', primary: '#1e293b', secondary: '#64748b' },
    ui: { sectionPadding: '5rem', maxWidth: '1280px', borderRadius: '1rem' }
  });
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const itemsRef = useRef(items);
  const themeSettingsRef = useRef(themeSettings);

  const untranslatedItems = items.filter(i => 
    i.key !== 'global_theme_settings' && 
    !i.key.startsWith('page_layout_') && 
    (!i.value_ko || !i.value_en)
  );

  useEffect(() => { itemsRef.current = items; themeSettingsRef.current = themeSettings; }, [items, themeSettings]);

  const { state: historyState, push: pushHistory, undo, redo, canUndo, canRedo, reset: resetHistory } = useHistory({ 
    items: [] as ContentItem[], 
    themeSettings: {
      colors: { accent: '#2563eb', primary: '#1e293b', secondary: '#64748b' },
      ui: { sectionPadding: '5rem', maxWidth: '1280px', borderRadius: '1rem' }
    } 
  });

  const handlePushHistory = useCallback(() => { pushHistory({ items: itemsRef.current, themeSettings: themeSettingsRef.current }); }, [pushHistory]);
  const handleUndo = useCallback(() => undo(), [undo]);
  const handleRedo = useCallback(() => redo(), [redo]);

  useEffect(() => {
    if (historyState.items.length > 0) {
        setItems(historyState.items);
        setThemeSettings(historyState.themeSettings);
        historyState.items.forEach(item => {
          iframeRef.current?.contentWindow?.postMessage({
            type: 'NKHB_LIVE_UPDATE', key: item.key,
            data: { text: editorLang === 'ko' ? item.value_ko : item.value_en, styles: item.style_props, link: item.style_props?.link }
          }, '*');
        });
        iframeRef.current?.contentWindow?.postMessage({ type: 'NKHB_LIVE_THEME_UPDATE', theme: historyState.themeSettings }, '*');
    }
  }, [historyState, editorLang]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') { if (e.shiftKey) handleRedo(); else handleUndo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') { e.preventDefault(); handleSave(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const fetchContent = async () => {
    try {
      const { data } = await supabase.from('content').select('*');
      if (data) {
        const normalized = data.map(item => ({ ...item, style_props: item.style_props || {} }));
        setItems(normalized);
        const theme = normalized.find(i => i.key === 'global_theme_settings');
        if (theme?.style_props) {
            const newThemeSettings = { colors: { ...themeSettings.colors, ...theme.style_props.colors }, ui: { ...themeSettings.ui, ...theme.style_props.ui } };
            setThemeSettings(newThemeSettings);
            resetHistory({ items: normalized, themeSettings: newThemeSettings });
        } else { resetHistory({ items: normalized, themeSettings }); }
      }
    } finally { setLoading(false); }
  };

  const updateTheme = (newSettings: typeof themeSettings) => {
    setThemeSettings(newSettings);
    setItems(prev => {
        const exists = prev.some(i => i.key === 'global_theme_settings');
        if (exists) return prev.map(i => i.key === 'global_theme_settings' ? { ...i, style_props: newSettings as any } : i);
        return [...prev, { id: `new-theme-${Date.now()}`, key: 'global_theme_settings', value_ko: '', value_en: '', style_props: newSettings as any }];
    });
    setModifiedIds(prev => new Set(prev).add('global_theme_settings'));
    if (iframeRef.current?.contentWindow) iframeRef.current.contentWindow.postMessage({ type: 'NKHB_LIVE_THEME_UPDATE', theme: newSettings }, '*');
  };

  const updateItem = (key: string, updates: Partial<ContentItem>) => {
    const currentItem = itemsRef.current.find(i => i.key === key);
    if (!currentItem) return;
    let finalUpdates = { ...updates };
    if (updates.style_props) finalUpdates.style_props = { ...currentItem.style_props, ...updates.style_props };
    setItems(prev => prev.map(i => i.key === key ? { ...i, ...finalUpdates } : i));
    setModifiedIds(prev => new Set(prev).add(key));
    if (iframeRef.current?.contentWindow) {
      const nextItem = { ...currentItem, ...finalUpdates };
      iframeRef.current.contentWindow.postMessage({
        type: 'NKHB_LIVE_UPDATE', key,
        data: {
            text: editorLang === 'ko' ? nextItem.value_ko : nextItem.value_en,
            styles: nextItem.style_props,
            link: isImageKey ? (editorLang === 'en' ? nextItem.value_en : nextItem.value_ko) : (nextItem.style_props?.link || nextItem.value_ko || nextItem.value_en)
        }
      }, '*');
    }
  };

  const handleTranslate = async (sourceField: 'value_ko' | 'value_en', targetField: 'value_ko' | 'value_en') => {
    if (!selectedItem || !selectedKey) return;
    const sourceText = selectedItem[sourceField];
    if (!sourceText) return;
    setTranslating(targetField);
    try {
        const targetLang = targetField === 'value_ko' ? 'KO' : 'EN';
        const translated = await translateText(sourceText, targetLang);
        updateItem(selectedKey, { [targetField]: translated });
        setTimeout(handlePushHistory, 0);
    } catch (err: any) { alert('번역 실패: ' + err.message); } finally { setTranslating(null); }
  };

  const handleLanguageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'value_ko' | 'value_en') => {
    const file = e.target.files?.[0];
    if (!file || !selectedKey) return;
    setUploading('OPTIMIZING...');
    try {
        const result = await optimizeImage(file);
        setUploading('UPLOADING...');
        const isOptimized = result.type === 'image/webp';
        const fileExt = isOptimized ? 'webp' : file.name.split('.').pop();
        const fileName = `${selectedKey}-${field}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `cms/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, result, { contentType: result.type, upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);
        updateItem(selectedKey, { [field]: publicUrl });
        setTimeout(handlePushHistory, 0);
        alert(`${field === 'value_ko' ? '한국어' : '영어'} 이미지가 업로드되었습니다.`);
    } catch (err: any) { alert('업로드 실패: ' + err.message); } finally { setUploading(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    const updatesMap = new Map<string, any>();
    items.filter(i => modifiedKeys.has(i.key)).forEach(i => updatesMap.set(i.key, { key: i.key, value_ko: i.value_ko, value_en: i.value_en, style_props: i.style_props }));
    const updates = Array.from(updatesMap.values());
    if (updates.length === 0) { setSaving(false); return; }
    try {
        const { error } = await supabase.from('content').upsert(updates, { onConflict: 'key' });
        if (error) throw error;
        setModifiedIds(new Set());
        alert('모든 변경 사항이 저장되었습니다.');
    } catch (err: any) { alert('저장 실패: ' + err.message); } finally { setSaving(false); }
  };

  const isImageKey = selectedKey?.includes('image') || selectedKey?.includes('logo') || selectedKey?.includes('bg') || (computedStyles?.backgroundImage && computedStyles.backgroundImage !== 'none');

  useEffect(() => {
    fetchContent();
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NKHB_ELEMENT_SELECTED') {
        const { key, computedStyles: cs, link, innerText } = event.data;
        let item = itemsRef.current.find(i => i.key === key);
        if (!item) {
            const newItem: ContentItem = { id: `new-${key}-${Date.now()}`, key, value_ko: isImageKey ? (link || '') : (editorLang === 'ko' ? innerText : ''), value_en: isImageKey ? (link || '') : (editorLang === 'en' ? innerText : ''), style_props: { ...cs, link: link || '' } };
            setItems(prev => [...prev, newItem]);
            setSelectedKey(key);
            setModifiedIds(prev => new Set(prev).add(key));
        } else {
            if (innerText || link) {
                setItems(prev => prev.map(i => {
                    if (i.key === key) {
                        const isImg = key.includes('image') || key.includes('logo') || key.includes('bg');
                        const updates: any = {};
                        if (editorLang === 'ko' && !i.value_ko) updates.value_ko = isImg ? link : innerText;
                        if (editorLang === 'en' && !i.value_en) updates.value_en = isImg ? link : innerText;
                        if (link && !i.style_props?.link) updates.style_props = { ...i.style_props, link };
                        return Object.keys(updates).length > 0 ? { ...i, ...updates } : i;
                    }
                    return i;
                }));
            }
            setSelectedKey(key);
        }
        setComputedStyles(cs);
        setSidebarOpen(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const currentLayoutKey = currentPage === '/' ? 'page_layout_home' : 'page_layout_about';
  const layoutItem = items.find(i => i.key === currentLayoutKey);
  const currentLayout = layoutItem?.style_props?.order || (currentPage === '/' ? HOME_DEFAULT_LAYOUT : ABOUT_DEFAULT_LAYOUT);

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newLayout = [...currentLayout];
    const draggedItem = newLayout[draggedIndex];
    newLayout.splice(draggedIndex, 1);
    newLayout.splice(index, 0, draggedItem);
    updateItem(currentLayoutKey, { style_props: { order: newLayout } });
    setDraggedIndex(index);
  };
  const handleDragEnd = () => { setDraggedIndex(null); handlePushHistory(); };

  const selectedItem = items.find(i => i.key === selectedKey);

  if (loading) return <div className="flex items-center justify-center h-screen bg-white"><Loader2 className="animate-spin text-blue-600 w-12 h-12" /></div>;

  return (
    <div className="flex h-screen bg-[#F0F2F5] overflow-hidden font-pretendard">
      <div className="flex-1 flex flex-col relative">
        <header className="h-16 bg-white/90 backdrop-blur-md border-b flex items-center justify-between px-6 z-20 shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"><ChevronLeft className="w-6 h-6" /></button>
                <div className="h-8 w-px bg-gray-200 mx-2"></div>
                <div><h1 className="text-lg font-black text-gray-900 tracking-tighter flex items-center gap-2"><Monitor className="w-5 h-5 text-blue-600" />Visual Editor</h1><p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Full-Screen Workspace</p></div>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setCurrentPage('/')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${currentPage === '/' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><LayoutIcon className="w-3.5 h-3.5" /> HOME</button>
                <button onClick={() => setCurrentPage('/about')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${currentPage === '/about' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Info className="w-3.5 h-3.5" /> ABOUT</button>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                <button onClick={() => setEditorLang('ko')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${editorLang === 'ko' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><span className="w-2 h-2 rounded-full bg-red-400" /> KO</button>
                <button onClick={() => setEditorLang('en')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${editorLang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><span className="w-2 h-2 rounded-full bg-blue-400" /> EN</button>
            </div>
            <div className="flex bg-gray-100 p-1 rounded-xl gap-1">
                <button onClick={() => setPreviewMode('desktop')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${previewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Monitor className="w-3.5 h-3.5" /> DESKTOP</button>
                <button onClick={() => setPreviewMode('mobile')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center gap-2 ${previewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}><Smartphone className="w-3.5 h-3.5" /> MOBILE</button>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <button onClick={handleUndo} disabled={!canUndo} className={`p-1.5 rounded-lg transition-all ${canUndo ? 'text-gray-600 hover:bg-white hover:shadow-sm active:scale-95' : 'text-gray-300 cursor-not-allowed opacity-50'}`}><RotateCcw className="w-4 h-4" /></button>
                    <button onClick={handleRedo} disabled={!canRedo} className={`p-1.5 rounded-lg transition-all ${canRedo ? 'text-gray-600 hover:bg-white hover:shadow-sm active:scale-95' : 'text-gray-300 cursor-not-allowed opacity-50'}`}><RotateCw className="w-4 h-4" /></button>
                </div>
                <button onClick={handleSave} disabled={saving || modifiedKeys.size === 0} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white px-8 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-900/20 active:scale-95">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}SAVE ALL</button>
            </div>
        </header>

        <main className="flex-1 overflow-hidden relative flex items-center justify-center p-0">
            <div className={`transition-all duration-700 ease-in-out shadow-2xl bg-white ${previewMode === 'desktop' ? 'w-full h-full' : 'w-[375px] h-[667px] my-8 rounded-[2rem] border-[8px] border-gray-900 overflow-hidden'}`}>
                <iframe ref={iframeRef} src={`${currentPage}${currentPage.includes('?') ? '&' : '?'}lang=${editorLang}`} className="w-full h-full border-none" title="Site Preview" />
            </div>
            {!sidebarOpen && <button onClick={() => setSidebarOpen(true)} className="absolute right-6 top-20 w-12 h-12 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-30"><Palette className="w-6 h-6" /></button>}
        </main>

        {modifiedKeys.size > 0 && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom-8 duration-500 border border-white/10 backdrop-blur-xl">
                <div className="flex flex-col"><span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Unsaved Changes</span><span className="text-sm font-bold">{modifiedKeys.size} elements modified</span></div>
                <div className="h-8 w-px bg-white/10"></div>
                <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2 rounded-xl text-xs font-black transition-all">PUBLISH NOW</button>
            </div>
        )}
      </div>

      <aside className={`w-96 bg-white border-l shadow-[-20px_0_50px_rgba(0,0,0,0.05)] transition-all duration-500 z-30 flex flex-col ${sidebarOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 absolute right-0'}`}>
        <div className="p-8 border-b flex flex-col gap-6">
            <div className="flex items-center justify-between"><h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Visual Editor</h2><button onClick={() => { setSelectedKey(null); setSidebarOpen(false); }} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button></div>
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button onClick={() => setActiveTab('properties')} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'properties' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>PROPERTIES</button>
                <button onClick={() => setActiveTab('structure')} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'structure' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>STRUCTURE</button>
                <button onClick={() => setActiveTab('theme')} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all ${activeTab === 'theme' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>THEME</button>
                <button onClick={() => setActiveTab('audit')} className={`flex-1 py-2 rounded-lg text-[10px] font-black transition-all relative ${activeTab === 'audit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>
                    AUDIT
                    {untranslatedItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full border-2 border-white animate-pulse">
                            {untranslatedItems.length}
                        </span>
                    )}
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            {activeTab === 'properties' ? (
                selectedItem ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* 1. TEXT CONTENT */}
                        <div className="space-y-6">
                            <label className="text-[11px] font-black text-blue-600 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full w-fit"><Type className="w-3.5 h-3.5" /> TEXT CONTENT</label>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">KOREAN</span>
                                        {editorLang === 'en' && (
                                            <button 
                                                onClick={() => handleTranslate('value_en', 'value_ko')}
                                                disabled={!!translating}
                                                className="text-[9px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full transition-all disabled:opacity-50"
                                            >
                                                {translating === 'value_ko' ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Globe className="w-2.5 h-2.5" />}
                                                AI Translate from EN
                                            </button>
                                        )}
                                    </div>
                                    <textarea value={selectedItem.value_ko} onChange={(e) => updateItem(selectedKey!, { value_ko: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none leading-relaxed shadow-inner" onBlur={handlePushHistory} />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ENGLISH</span>
                                        {editorLang === 'ko' && (
                                            <button 
                                                onClick={() => handleTranslate('value_ko', 'value_en')}
                                                disabled={!!translating}
                                                className="text-[9px] font-bold text-blue-500 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full transition-all disabled:opacity-50"
                                            >
                                                {translating === 'value_en' ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Globe className="w-2.5 h-2.5" />}
                                                AI Translate from KO
                                            </button>
                                        )}
                                    </div>
                                    <textarea value={selectedItem.value_en} onChange={(e) => updateItem(selectedKey!, { value_en: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-none leading-relaxed shadow-inner" onBlur={handlePushHistory} />
                                </div>
                            </div>
                        </div>

                        {/* 2. IMAGE ASSETS & LINKS */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <label className="text-[11px] font-black text-indigo-600 flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full w-fit">{isImageKey ? <ImageIcon className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />} {isImageKey ? 'BILINGUAL IMAGE ASSETS' : 'LINK / URL'}</label>
                            {isImageKey ? (
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">KOREAN IMAGE</span>
                                        <div className="w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative group/img">
                                            {selectedItem.value_ko ? <img src={selectedItem.value_ko} alt="KO Preview" className="max-h-full max-w-full object-contain" /> : <ImageIcon className="text-gray-200 w-12 h-12" />}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"><label className={`bg-white text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer shadow-xl transition-transform flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>{uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'CHANGE KO'}<input type="file" className="hidden" accept="image/*" onChange={(e) => handleLanguageFileUpload(e, 'value_ko')} /></label></div>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">ENGLISH IMAGE</span>
                                        <div className="w-full aspect-video bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative group/img">
                                            {selectedItem.value_en ? <img src={selectedItem.value_en} alt="EN Preview" className="max-h-full max-w-full object-contain" /> : <ImageIcon className="text-gray-200 w-12 h-12" />}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"><label className={`bg-white text-gray-900 px-4 py-2 rounded-xl text-[10px] font-black cursor-pointer shadow-xl transition-transform flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>{uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'CHANGE EN'}<input type="file" className="hidden" accept="image/*" onChange={(e) => handleLanguageFileUpload(e, 'value_en')} /></label></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group"><input type="text" value={selectedItem.style_props?.link || ''} placeholder="https://... 또는 /path" onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, link: e.target.value } })} className="w-full p-4 bg-gray-50 border-none rounded-2xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 shadow-inner" onBlur={handlePushHistory} /><Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-indigo-500" /></div>
                            )}
                        </div>

                        {/* 3. MOBILE OPTIMIZATION */}
                        <div className="space-y-6 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black text-orange-600 flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full w-fit"><Smartphone className="w-3.5 h-3.5" /> MOBILE STYLE</label>
                                <button onClick={() => { const { mobile, ...rest } = selectedItem.style_props; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, mobile: { ...rest } } }); handlePushHistory(); }} className="text-[9px] font-black text-orange-500 hover:bg-orange-100 px-2 py-1 rounded transition-colors uppercase">Copy from Desktop</button>
                            </div>
                            <div className={`p-6 rounded-3xl border-2 transition-all ${previewMode === 'mobile' ? 'bg-orange-50/50 border-orange-200' : 'bg-gray-50 border-transparent opacity-60'}`}>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-gray-400 ml-1 uppercase">M-Font Size</span>
                                        <input type="text" value={selectedItem.style_props?.mobile?.fontSize || ''} placeholder={selectedItem.style_props?.fontSize || computedStyles?.fontSize} onChange={(e) => { const mobile = { ...(selectedItem.style_props.mobile || {}), fontSize: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, mobile } }); }} className="w-full p-3 bg-white border-none rounded-xl text-xs font-bold shadow-sm focus:ring-2 focus:ring-orange-500" onBlur={handlePushHistory} />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[9px] font-black text-gray-400 ml-1 uppercase">M-Margin</span>
                                        <input type="text" value={selectedItem.style_props?.mobile?.margin || ''} placeholder={selectedItem.style_props?.margin || computedStyles?.margin} onChange={(e) => { const mobile = { ...(selectedItem.style_props.mobile || {}), margin: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, mobile } }); }} className="w-full p-3 bg-white border-none rounded-xl text-xs font-bold shadow-sm focus:ring-2 focus:ring-orange-500" onBlur={handlePushHistory} />
                                    </div>
                                    {isImageKey && (
                                        <>
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black text-gray-400 ml-1 uppercase">M-Width</span>
                                                <input type="text" value={selectedItem.style_props?.mobile?.width || ''} placeholder={selectedItem.style_props?.width || 'auto'} onChange={(e) => { const mobile = { ...(selectedItem.style_props.mobile || {}), width: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, mobile } }); }} className="w-full p-3 bg-white border-none rounded-xl text-xs font-bold shadow-sm focus:ring-2 focus:ring-orange-500" onBlur={handlePushHistory} />
                                            </div>
                                            <div className="space-y-2">
                                                <span className="text-[9px] font-black text-gray-400 ml-1 uppercase">M-Height</span>
                                                <input type="text" value={selectedItem.style_props?.mobile?.height || ''} placeholder={selectedItem.style_props?.height || 'auto'} onChange={(e) => { const mobile = { ...(selectedItem.style_props.mobile || {}), height: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, mobile } }); }} className="w-full p-3 bg-white border-none rounded-xl text-xs font-bold shadow-sm focus:ring-2 focus:ring-orange-500" onBlur={handlePushHistory} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 4. DESKTOP STYLE */}
                        <div className="space-y-6 pt-4 border-t border-gray-100">
                            <label className="text-[11px] font-black text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full w-fit"><Maximize className="w-3.5 h-3.5" /> DESKTOP STYLE</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-gray-400 ml-1">FONT SIZE</span>
                                    <input type="text" value={selectedItem.style_props?.fontSize || ''} placeholder={computedStyles?.fontSize} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, fontSize: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} />
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-gray-400 ml-1">MARGIN</span>
                                    <input type="text" value={selectedItem.style_props?.margin || ''} placeholder={computedStyles?.margin} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, margin: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} />
                                </div>
                                {isImageKey && (
                                    <>
                                        <div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1 uppercase">Width</span><input type="text" value={selectedItem.style_props?.width || ''} placeholder={selectedItem.style_props?.width || 'auto'} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, width: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} /></div>
                                        <div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1 uppercase">Height</span><input type="text" value={selectedItem.style_props?.height || ''} placeholder={selectedItem.style_props?.height || 'auto'} onChange={(e) => updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, height: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} /></div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 5. COLORS */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <label className="text-[11px] font-black text-rose-600 flex items-center gap-2 bg-rose-50 px-3 py-1.5 rounded-full w-fit"><Palette className="w-3.5 h-3.5" /> COLORS & BACKGROUND</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-gray-400 ml-1">TEXT COLOR</span>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden relative border-4 border-white shadow-lg"><input type="color" value={(previewMode === 'mobile' ? (selectedItem.style_props?.mobile?.color || computedStyles?.color) : (selectedItem.style_props?.color || computedStyles?.color))?.startsWith('#') ? (previewMode === 'mobile' ? (selectedItem.style_props?.mobile?.color || computedStyles?.color) : (selectedItem.style_props?.color || computedStyles?.color)) : '#000000'} onChange={(e) => { const prop = previewMode === 'mobile' ? { mobile: { ...(selectedItem.style_props.mobile || {}), color: e.target.value } } : { color: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, ...prop } }); }} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" onBlur={handlePushHistory} /></div>
                                        <input type="text" value={(previewMode === 'mobile' ? selectedItem.style_props?.mobile?.color : selectedItem.style_props?.color) || ''} placeholder={computedStyles?.color} onChange={(e) => { const prop = previewMode === 'mobile' ? { mobile: { ...(selectedItem.style_props.mobile || {}), color: e.target.value } } : { color: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, ...prop } }); }} className="flex-1 bg-gray-50 border-none rounded-xl text-[10px] uppercase font-black text-center shadow-inner" onBlur={handlePushHistory} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black text-gray-400 ml-1">BACKGROUND</span>
                                    <div className="flex gap-2">
                                        <div className="w-10 h-10 rounded-xl overflow-hidden relative border-4 border-white shadow-lg"><input type="color" value={(previewMode === 'mobile' ? (selectedItem.style_props?.mobile?.backgroundColor || computedStyles?.backgroundColor) : (selectedItem.style_props?.backgroundColor || computedStyles?.backgroundColor))?.startsWith('#') ? (previewMode === 'mobile' ? (selectedItem.style_props?.mobile?.backgroundColor || computedStyles?.backgroundColor) : (selectedItem.style_props?.backgroundColor || computedStyles?.backgroundColor)) : '#FFFFFF'} onChange={(e) => { const prop = previewMode === 'mobile' ? { mobile: { ...(selectedItem.style_props.mobile || {}), backgroundColor: e.target.value } } : { backgroundColor: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, ...prop } }); }} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" onBlur={handlePushHistory} /></div>
                                        <input type="text" value={(previewMode === 'mobile' ? selectedItem.style_props?.mobile?.backgroundColor : selectedItem.style_props?.backgroundColor) || ''} placeholder={computedStyles?.backgroundColor || 'Transparent'} onChange={(e) => { const prop = previewMode === 'mobile' ? { mobile: { ...(selectedItem.style_props.mobile || {}), backgroundColor: e.target.value } } : { backgroundColor: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, ...prop } }); }} className="flex-1 bg-gray-50 border-none rounded-xl text-[10px] uppercase font-black text-center shadow-inner" onBlur={handlePushHistory} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6. BORDERS */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <label className="text-[11px] font-black text-amber-600 flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full w-fit"><Maximize className="w-3.5 h-3.5" /> BORDERS & ROUNDING</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1">BORDER RADIUS</span><input type="text" value={(previewMode === 'mobile' ? selectedItem.style_props?.mobile?.borderRadius : selectedItem.style_props?.borderRadius) || ''} placeholder={computedStyles?.borderRadius} onChange={(e) => { const prop = previewMode === 'mobile' ? { mobile: { ...(selectedItem.style_props.mobile || {}), borderRadius: e.target.value } } : { borderRadius: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, ...prop } }); }} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} /></div>
                                <div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1">BORDER WIDTH</span><input type="text" value={(previewMode === 'mobile' ? selectedItem.style_props?.mobile?.borderWidth : selectedItem.style_props?.borderWidth) || ''} placeholder={computedStyles?.borderWidth} onChange={(e) => { const prop = previewMode === 'mobile' ? { mobile: { ...(selectedItem.style_props.mobile || {}), borderWidth: e.target.value } } : { borderWidth: e.target.value }; updateItem(selectedKey!, { style_props: { ...selectedItem.style_props, ...prop } }); }} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} /></div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center shadow-inner"><Monitor className="w-10 h-10 text-gray-300" /></div>
                        <div className="space-y-2"><p className="text-base font-black text-gray-900 uppercase tracking-tight">Select an Element</p><p className="text-xs text-gray-400 px-8 leading-relaxed font-medium">Click on any text or button in the preview window to start editing its properties.</p></div>
                    </div>
                )
            ) : activeTab === 'structure' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <label className="text-[11px] font-black text-blue-600 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full w-fit mb-6"><LayoutIcon className="w-3.5 h-3.5" /> PAGE STRUCTURE</label>
                    <div className="space-y-2">
                        {currentLayout.map((sectionKey: string, index: number) => (
                            <div key={sectionKey} draggable onDragStart={() => handleDragStart(index)} onDragOver={(e) => handleDragOver(e, index)} onDragEnd={handleDragEnd} className={`flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 cursor-grab active:cursor-grabbing transition-all ${draggedIndex === index ? 'opacity-50 scale-95' : 'hover:shadow-md hover:border-blue-200'}`}><GripVertical className="w-5 h-5 text-gray-400" /><span className="text-sm font-bold text-gray-700">{SECTION_LABELS[sectionKey] || sectionKey}</span></div>
                        ))}
                    </div>
                </div>
            ) : activeTab === 'audit' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-red-600 flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full w-fit"><Languages className="w-3.5 h-3.5" /> TRANSLATION AUDIT</label>
                        <span className="text-[10px] font-bold text-gray-400">{untranslatedItems.length} issues found</span>
                    </div>
                    
                    {untranslatedItems.length > 0 ? (
                        <div className="space-y-3">
                            {untranslatedItems.map(item => (
                                <button 
                                    key={item.id}
                                    onClick={() => {
                                        setSelectedKey(item.key);
                                        setActiveTab('properties');
                                    }}
                                    className="w-full p-4 bg-gray-50 hover:bg-white hover:shadow-md rounded-2xl border border-gray-100 transition-all text-left flex flex-col gap-2 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.key}</span>
                                        <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className={`flex-1 h-1.5 rounded-full ${item.value_ko ? 'bg-blue-200' : 'bg-red-200 animate-pulse'}`} title="Korean" />
                                        <div className={`flex-1 h-1.5 rounded-full ${item.value_en ? 'bg-blue-200' : 'bg-red-200 animate-pulse'}`} title="English" />
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-700 line-clamp-1 group-hover:text-blue-600">{item.value_ko || item.value_en || 'Empty Content'}</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shadow-inner"><Globe className="w-8 h-8 text-blue-300" /></div>
                            <div className="space-y-1"><p className="text-sm font-black text-gray-900 uppercase">All Translated!</p><p className="text-[10px] text-gray-400 px-8">No missing translations found across the site.</p></div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="space-y-6">
                        <label className="text-[11px] font-black text-blue-600 flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full w-fit"><Palette className="w-3.5 h-3.5" /> BRAND COLORS</label>
                        <div className="space-y-4">
                            <div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1 uppercase tracking-widest">Accent Color</span><div className="flex gap-2"><div className="w-10 h-10 rounded-xl overflow-hidden relative border-4 border-white shadow-lg"><input type="color" value={themeSettings.colors.accent} onChange={(e) => updateTheme({ ...themeSettings, colors: { ...themeSettings.colors, accent: e.target.value } })} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" onBlur={handlePushHistory} /></div><input type="text" value={themeSettings.colors.accent} onChange={(e) => updateTheme({ ...themeSettings, colors: { ...themeSettings.colors, accent: e.target.value } })} className="flex-1 bg-gray-50 border-none rounded-xl text-[10px] uppercase font-black text-center shadow-inner" onBlur={handlePushHistory} /></div></div>
                            <div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1 uppercase tracking-widest">Primary Color</span><div className="flex gap-2"><div className="w-10 h-10 rounded-xl overflow-hidden relative border-4 border-white shadow-lg"><input type="color" value={themeSettings.colors.primary} onChange={(e) => updateTheme({ ...themeSettings, colors: { ...themeSettings.colors, primary: e.target.value } })} className="absolute inset-[-10px] w-[200%] h-[200%] cursor-pointer" onBlur={handlePushHistory} /></div><input type="text" value={themeSettings.colors.primary} onChange={(e) => updateTheme({ ...themeSettings, colors: { ...themeSettings.colors, primary: e.target.value } })} className="flex-1 bg-gray-50 border-none rounded-xl text-[10px] uppercase font-black text-center shadow-inner" onBlur={handlePushHistory} /></div></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <label className="text-[11px] font-black text-indigo-600 flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full w-fit"><LayoutIcon className="w-3.5 h-3.5" /> LAYOUT</label>
                        <div className="space-y-4">
                            <div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1 uppercase tracking-widest">Section Padding</span><input type="text" value={themeSettings.ui.sectionPadding} onChange={(e) => updateTheme({ ...themeSettings, ui: { ...themeSettings.ui, sectionPadding: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} /></div>
                            <div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1 uppercase tracking-widest">Max Width</span><input type="text" value={themeSettings.ui.maxWidth} onChange={(e) => updateTheme({ ...themeSettings, ui: { ...themeSettings.ui, maxWidth: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} /></div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <label className="text-[11px] font-black text-emerald-600 flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full w-fit"><Maximize className="w-3.5 h-3.5" /> UI STYLE</label>
                        <div className="space-y-4"><div className="space-y-2"><span className="text-[9px] font-black text-gray-400 ml-1 uppercase tracking-widest">Global Border Radius</span><input type="text" value={themeSettings.ui.borderRadius} onChange={(e) => updateTheme({ ...themeSettings, ui: { ...themeSettings.ui, borderRadius: e.target.value } })} className="w-full p-3 bg-gray-50 border-none rounded-xl text-xs font-bold shadow-inner" onBlur={handlePushHistory} /></div></div>
                    </div>
                </div>
            )}
        </div>
      </aside>
    </div>
  );
};

export default Content;
