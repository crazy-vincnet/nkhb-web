import React, { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Upload, 
  Search, 
  Globe, 
  Languages,
  ImageIcon,
  Layout,
  Info,
  Radio,
  Heart,
  Settings,
  Zap,
  RotateCcw,
  AlertCircle,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const SECTIONS = [
  { id: 'hero', label: '히어로', icon: Layout, pattern: ['hero_', 'image_hero'] },
  { id: 'background', label: '방송배경', icon: Info, pattern: ['background_', 'image_background'] },
  { id: 'composition', label: '방송구성', icon: Radio, pattern: ['composition_', 'sample_', 'track'] },
  { id: 'effects', label: '기대효과', icon: Heart, pattern: ['effects_'] },
  { id: 'reach', label: '도달범위', icon: Globe, pattern: ['reach_', 'image_reach'] },
  { id: 'guide', label: '참여안내', icon: Info, pattern: ['guide_', 'letter_modal'] },
  { id: 'support', label: '후원하기', icon: Heart, pattern: ['support_'] },
  { id: 'schedule', label: '방송시간', icon: Settings, pattern: ['schedule_'] },
  { id: 'nav', label: '공통/메뉴', icon: Globe, pattern: ['nav_', 'footer_', 'page_', 'alt_logo'] },
  { id: 'seo', label: 'SEO', icon: Search, pattern: ['meta_'] },
];

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [originalContent, setOriginalContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'missing' | 'modified'>('all');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [batchSaving, setBatchSaving] = useState(false);
  const [uploading, setUploading] = useState<{id: string, field: string} | null>(null);
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('content').select('*').order('key', { ascending: true });
    if (!error) {
        setContent(data || []);
        setOriginalContent(JSON.parse(JSON.stringify(data || [])));
    }
    setLoading(false);
  };

  const isImageUrlKey = (key: string) => {
    const k = key.toLowerCase();
    return k.includes('logo') || k.includes('image') || k.includes('url') || k.startsWith('image_');
  };

  const sectionStats = useMemo(() => {
    const stats: { [key: string]: { total: number; missing: number } } = {};
    SECTIONS.forEach(s => {
        const items = content.filter(item => s.pattern.some(p => item.key.toLowerCase().startsWith(p) || item.key.toLowerCase().includes(p)));
        stats[s.id] = {
            total: items.length,
            missing: items.filter(i => !i.value_en || !i.value_ko).length
        };
    });
    return stats;
  }, [content]);

  const filteredItems = useMemo(() => {
    let items = content;
    
    // 1. Search Filter
    if (searchQuery) {
        items = items.filter(item => 
            (item.key || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.value_ko || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.value_en || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else {
        const section = SECTIONS.find(s => s.id === activeTab);
        items = items.filter(item => section?.pattern.some(p => item.key.toLowerCase().startsWith(p) || item.key.toLowerCase().includes(p)));
    }

    // 2. Status Filter
    if (statusFilter === 'missing') {
        items = items.filter(i => !i.value_en || !i.value_ko);
    } else if (statusFilter === 'modified') {
        items = items.filter(i => modifiedIds.has(i.id));
    }

    return items;
  }, [content, activeTab, searchQuery, statusFilter, modifiedIds]);

  const handleUpdate = async (item: ContentItem) => {
    setSavingId(item.id);
    const { error } = await supabase.from('content').update({ value_ko: item.value_ko, value_en: item.value_en }).eq('id', item.id);
    if (!error) {
        setOriginalContent(prev => prev.map(o => o.id === item.id ? { ...item } : o));
        setModifiedIds(prev => {
            const next = new Set(prev);
            next.delete(item.id);
            return next;
        });
        setTimeout(() => setSavingId(null), 800);
    } else {
        alert('저장 실패: ' + error.message);
        setSavingId(null);
    }
  };

  const handleBatchUpdate = async () => {
    const itemsToUpdate = content.filter(i => modifiedIds.has(i.id));
    if (itemsToUpdate.length === 0) return;

    setBatchSaving(true);
    try {
        const updates = itemsToUpdate.map(item => ({
            id: item.id,
            key: item.key,
            value_ko: item.value_ko,
            value_en: item.value_en
        }));

        const { error } = await supabase.from('content').upsert(updates);
        if (error) throw error;

        setOriginalContent(prev => {
            const next = [...prev];
            updates.forEach(upd => {
                const idx = next.findIndex(o => o.id === upd.id);
                if (idx > -1) next[idx] = { ...upd };
            });
            return next;
        });
        setModifiedIds(new Set());
        alert('모든 변경사항이 저장되었습니다.');
    } catch (error: any) {
        alert('일괄 저장 실패: ' + error.message);
    } finally {
        setBatchSaving(false);
    }
  };

  const handleChange = (id: string, field: 'value_ko' | 'value_en', value: string) => {
    setContent(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    
    // Deep compare to check if truly modified
    const original = originalContent.find(o => o.id === id);
    if (!original) return;
    
    const current = content.find(c => c.id === id);
    const nextVal = { ...(current || original), [field]: value };
    const isModified = nextVal.value_ko !== original.value_ko || nextVal.value_en !== original.value_en;

    setModifiedIds(prev => {
        const next = new Set(prev);
        if (isModified) next.add(id);
        else next.delete(id);
        return next;
    });
  };

  const revertItem = (id: string) => {
    const original = originalContent.find(o => o.id === id);
    if (original) {
        setContent(prev => prev.map(item => item.id === id ? { ...original } : item));
        setModifiedIds(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
    }
  };

  const handleFileUpload = async (id: string, field: 'value_ko' | 'value_en', file: File) => {
    try {
      setUploading({ id, field });
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `site-assets/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(filePath);
      handleChange(id, field, publicUrl);
    } catch (error: any) {
      alert('업로드 에러: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 lg:p-8 font-pretendard">
      
      {/* Header & Main Controls */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 mb-8 sticky top-4 z-40">
        <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex flex-col xl:flex-row gap-6 justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Zap className="w-6 h-6 text-white fill-current" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Content Workspace</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Quick & Precision Editing</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                {/* Search */}
                <div className="relative flex-1 xl:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" placeholder="항목 키워드 또는 내용 검색..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.25rem] text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>

                {/* Status Filter */}
                <div className="flex bg-gray-50 dark:bg-gray-800 p-1.5 rounded-[1.25rem] gap-1">
                    {[
                        { id: 'all', label: '전체', icon: Filter },
                        { id: 'missing', label: '번역 누락', icon: AlertCircle },
                        { id: 'modified', label: '수정됨', icon: Zap }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setStatusFilter(f.id as any)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${statusFilter === f.id ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm shadow-gray-200/50' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {statusFilter === f.id && <f.icon size={12} />}
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Batch Save */}
                <button
                    onClick={handleBatchUpdate}
                    disabled={modifiedIds.size === 0 || batchSaving}
                    className={`flex items-center gap-2.5 px-8 py-3.5 rounded-[1.25rem] text-sm font-black transition-all shadow-2xl ${modifiedIds.size > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                    {batchSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    {modifiedIds.size > 0 ? `${modifiedIds.size}개 일괄 저장` : '변경사항 없음'}
                </button>
            </div>
        </div>

        {/* Section Tabs */}
        <div className="flex overflow-x-auto p-3 gap-2 custom-scrollbar bg-gray-50/30 dark:bg-gray-800/20 rounded-b-3xl">
            {SECTIONS.map((tab) => {
                const stats = sectionStats[tab.id];
                const isActive = activeTab === tab.id && !searchQuery;
                return (
                    <button
                        key={tab.id}
                        onClick={() => {setActiveTab(tab.id); setSearchQuery('');}}
                        className={`flex-shrink-0 flex flex-col items-center gap-1 min-w-[100px] p-3 rounded-2xl transition-all ${isActive ? 'bg-white dark:bg-gray-700 shadow-sm ring-1 ring-gray-100 dark:ring-gray-600' : 'hover:bg-white/50 dark:hover:bg-gray-800/50'}`}
                    >
                        <tab.icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-300'} />
                        <span className={`text-[11px] font-black uppercase tracking-tighter ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{tab.label}</span>
                        <div className="flex gap-0.5 mt-1">
                            {stats.missing > 0 ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
      </div>

      {/* Editor Grid */}
      <div className="space-y-6 pb-20">
        {filteredItems.map((item) => (
            <div 
                key={item.id} 
                className={`bg-white dark:bg-gray-900 rounded-[2rem] border transition-all ${
                    modifiedIds.has(item.id) 
                    ? 'border-blue-400 ring-4 ring-blue-500/5 shadow-2xl scale-[1.01]' 
                    : 'border-gray-100 dark:border-gray-800 shadow-sm'
                }`}
            >
                {/* Row Header */}
                <div className="px-8 py-4 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <code className="text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                            {item.key}
                        </code>
                        {isImageUrlKey(item.key) && <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">Image Resource</span>}
                        {(!item.value_en || !item.value_ko) && (
                            <span className="flex items-center gap-1 text-[9px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                                <AlertCircle size={10} /> 번역 필요
                            </span>
                        )}
                        {modifiedIds.has(item.id) && <span className="text-[9px] bg-rose-600 text-white px-2 py-0.5 rounded-md font-black uppercase tracking-wider animate-pulse">수정 중</span>}
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {modifiedIds.has(item.id) && (
                            <button
                                onClick={() => revertItem(item.id)}
                                className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                title="원래대로 되돌리기"
                            >
                                <RotateCcw size={16} />
                            </button>
                        )}
                        <button
                            onClick={() => handleUpdate(item)}
                            disabled={savingId === item.id || !modifiedIds.has(item.id)}
                            className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black transition-all ${
                                modifiedIds.has(item.id) 
                                ? 'bg-gray-900 text-white hover:bg-black shadow-xl' 
                                : 'text-gray-300 cursor-default'
                            }`}
                        >
                            {savingId === item.id ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Save size={16} />}
                            {savingId === item.id ? '저장 완료' : '반영'}
                        </button>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* KO */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-200" /> 한국어 원문
                            </h4>
                            <span className="text-[10px] font-bold text-gray-300">{item.value_ko?.length || 0} 자</span>
                        </div>
                        {isImageUrlKey(item.key) ? (
                            <ImageRow value={item.value_ko} onChange={(v: string) => handleChange(item.id, 'value_ko', v)} onUpload={(f: File) => handleFileUpload(item.id, 'value_ko', f)} isUploading={uploading?.id === item.id && uploading?.field === 'value_ko'} />
                        ) : (
                            <AutoResizeTextarea
                                value={item.value_ko || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(item.id, 'value_ko', e.target.value)}
                                className={`w-full p-6 text-base border-2 ${!item.value_ko ? 'border-amber-100 bg-amber-50/10' : 'border-gray-50 dark:border-gray-800'} dark:bg-gray-800 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none min-h-[120px] transition-all font-medium leading-relaxed resize-none`}
                                placeholder="한국어 내용을 입력하세요..."
                            />
                        )}
                    </div>

                    {/* EN */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between px-1">
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-200" /> English
                            </h4>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleChange(item.id, 'value_en', item.value_ko)} 
                                    className="text-[9px] font-black text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-all uppercase flex items-center gap-1"
                                >
                                    <Languages size={10} /> Sync from KO
                                </button>
                                <span className="text-[10px] font-bold text-gray-300">{item.value_en?.length || 0} 자</span>
                            </div>
                        </div>
                        {isImageUrlKey(item.key) ? (
                            <ImageRow value={item.value_en} onChange={(v: string) => handleChange(item.id, 'value_en', v)} onUpload={(f: File) => handleFileUpload(item.id, 'value_en', f)} isUploading={uploading?.id === item.id && uploading?.field === 'value_en'} />
                        ) : (
                            <AutoResizeTextarea
                                value={item.value_en || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(item.id, 'value_en', e.target.value)}
                                className={`w-full p-6 text-base border-2 ${!item.value_en ? 'border-amber-100 bg-amber-50/10' : 'border-gray-50 dark:border-gray-800'} dark:bg-gray-800 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none min-h-[120px] transition-all font-medium leading-relaxed resize-none`}
                                placeholder="Enter translation here..."
                            />
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-40 text-center bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
            <Search className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <p className="text-gray-400 text-lg font-bold">일치하는 콘텐츠를 찾을 수 없습니다.</p>
            <button onClick={() => {setSearchQuery(''); setStatusFilter('all');}} className="mt-4 text-blue-600 font-bold hover:underline">모든 필터 초기화</button>
        </div>
      )}
    </div>
  );
};

const AutoResizeTextarea = ({ value, onChange, className, placeholder }: any) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [value]);
    return <textarea ref={textareaRef} value={value} onChange={onChange} className={className} placeholder={placeholder} />;
};

const ImageRow = ({ value, onChange, onUpload, isUploading }: { value: string; onChange: (v: string) => void; onUpload: (f: File) => void; isUploading: boolean }) => (
  <div className="space-y-4">
    <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-[1.5rem] overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-700 group/img relative transition-all hover:border-blue-300">
        {value ? <img src={value} className="max-h-full max-w-full object-contain p-4 transition-transform group-hover/img:scale-105" /> : <ImageIcon size={32} className="text-gray-200" />}
        
        {isUploading && (
            <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        )}

        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center gap-3">
            <label className="cursor-pointer bg-white text-gray-900 px-5 py-2 rounded-xl text-xs font-black hover:bg-gray-100 transition-all flex items-center gap-2">
                <Upload size={14} /> 교체
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} />
            </label>
            {value && <a href={value} target="_blank" rel="noreferrer" className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl transition-all font-bold text-xs"><ImageIcon size={14} /></a>}
        </div>
    </div>
    <div className="relative group/url">
        <input 
            type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} 
            className="w-full pl-4 pr-10 py-3 text-[11px] bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-1 focus:ring-blue-500 font-mono transition-all" 
            placeholder="직접 이미지 URL 입력 (https://...)" 
        />
        <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-focus-within/url:text-blue-500 transition-colors" />
    </div>
  </div>
);

export default Content;
