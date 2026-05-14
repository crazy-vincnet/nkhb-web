import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Upload, 
  Search, 
  ChevronRight, 
  Layout, 
  Image as ImageIcon, 
  Globe, 
  Info, 
  Settings, 
  Radio, 
  Heart,
  Layers,
  CheckCircle2,
  Copy,
  Languages,
  ExternalLink,
  Zap,
  ChevronLeft,
  X,
  FileText
} from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const SECTIONS = [
  { id: 'nav', label: '네비게이션/공통', icon: Globe, pattern: ['nav_', 'footer_', 'page_', 'alt_logo'], desc: '메뉴, 푸터, 로고 및 사이트 전역에서 사용되는 공통 문구', link: '/' },
  { id: 'hero', label: '히어로 섹션', icon: Layout, pattern: ['hero_', 'image_hero'], desc: '메인 페이지 상단 비주얼 및 환영 메시지', link: '/#hero' },
  { id: 'background', label: '방송배경 (01)', icon: Info, pattern: ['background_', 'image_background'], desc: '방송 취지 및 설립 배경 섹션', link: '/#about' },
  { id: 'composition', label: '방송구성 (02)', icon: Radio, pattern: ['composition_', 'sample_', 'track'], desc: '라디오 프로그램 구성 및 샘플 듣기', link: '/#composition' },
  { id: 'effects', label: '기대효과 (03)', icon: Heart, pattern: ['effects_'], desc: '대북 방송의 긍정적 영향력 설명', link: '/#effects' },
  { id: 'reach', label: '도달범위 (04)', icon: Globe, pattern: ['reach_', 'image_reach'], desc: '방송 송출 범위 및 청취자 현황', link: '/#reach' },
  { id: 'guide', label: '참여안내 (05)', icon: Info, pattern: ['guide_', 'letter_modal'], desc: '사연 보내기 및 참여 방법 안내', link: '/#guide' },
  { id: 'support', label: '후원하기 (06)', icon: Heart, pattern: ['support_'], desc: '후원 안내 및 계좌 정보', link: '/#support' },
  { id: 'schedule', label: '방송시간 (07)', icon: Settings, pattern: ['schedule_'], desc: '방송 시간표 및 주파수 안내', link: '/#schedule' },
  { id: 'about', label: 'NKFI 소개페이지', icon: Info, pattern: ['about_', 'image_about'], desc: '단체 소개 및 연혁 페이지 콘텐츠', link: '/about' },
  { id: 'seo', label: 'SEO/메타데이터', icon: Search, pattern: ['meta_'], desc: '검색 엔진 최적화 및 공유 시 미리보기 정보' },
];

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'missing' | 'image'>('all');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{id: string, field: string} | null>(null);
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());
  const [originalContent, setOriginalContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('key', { ascending: true });

    if (error) {
      console.error('Error fetching content:', error);
    } else {
      setContent(data || []);
      setOriginalContent(JSON.parse(JSON.stringify(data || [])));
    }
    setLoading(false);
  };

  const isImageUrlKey = (key: string) => {
    const k = key.toLowerCase();
    return k.includes('logo') || k.includes('image') || k.includes('url') || k.startsWith('image_');
  };

  const getFilteredItems = useCallback((sectionId: string | null, search: string, filter: string) => {
    let result = content;

    if (search) {
      result = result.filter(item => 
        (item.key?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (item.value_ko?.toLowerCase() || '').includes(search.toLowerCase()) ||
        (item.value_en?.toLowerCase() || '').includes(search.toLowerCase())
      );
    }

    if (sectionId && sectionId !== 'all') {
      const section = SECTIONS.find(s => s.id === sectionId);
      if (section?.pattern) {
        result = result.filter(item => 
          section.pattern?.some(p => (item.key?.toLowerCase() || '').startsWith(p) || (item.key?.toLowerCase() || '').includes(p))
        );
      }
    }

    if (filter === 'missing') {
      result = result.filter(item => !item.value_ko || !item.value_en);
    } else if (filter === 'image') {
      result = result.filter(item => isImageUrlKey(item.key));
    }

    return result;
  }, [content]);

  const filteredContent = useMemo(() => 
    getFilteredItems(activeSection, searchQuery, statusFilter), 
  [getFilteredItems, activeSection, searchQuery, statusFilter]);

  const handleUpdate = async (item: ContentItem) => {
    setSaving(item.id);
    const { error } = await supabase
      .from('content')
      .update({ 
        value_ko: item.value_ko, 
        value_en: item.value_en 
      })
      .eq('id', item.id);

    if (error) {
      console.error('Error updating content:', error);
      alert('저장 실패: ' + error.message);
    } else {
      setOriginalContent(prev => prev.map(o => o.id === item.id ? { ...item } : o));
      const nextModified = new Set(modifiedIds);
      nextModified.delete(item.id);
      setModifiedIds(nextModified);
      setTimeout(() => setSaving(null), 800);
    }
  };

  const handleBatchUpdate = async (items: ContentItem[]) => {
    try {
      const updates = items.map(item => ({
        id: item.id,
        key: item.key,
        value_ko: item.value_ko,
        value_en: item.value_en
      }));

      const { error } = await supabase.from('content').upsert(updates);
      if (error) throw error;
      
      const nextModified = new Set(modifiedIds);
      setOriginalContent(prev => {
        const next = [...prev];
        items.forEach(item => {
          const idx = next.findIndex(o => o.id === item.id);
          if (idx > -1) next[idx] = { ...item };
          nextModified.delete(item.id);
        });
        return next;
      });
      setModifiedIds(nextModified);
      alert('변경사항이 모두 저장되었습니다.');
    } catch (error: any) {
      alert('저장 실패: ' + error.message);
    }
  };

  const handleChange = (id: string, field: 'value_ko' | 'value_en', value: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    
    if (selectedItem?.id === id) {
        setSelectedItem(prev => prev ? { ...prev, [field]: value } : null);
    }

    const original = originalContent.find(o => o.id === id);
    if (!original) return;

    const current = content.find(c => c.id === id);
    const nextVal = { ...(current || original), [field]: value };
    const isModified = nextVal.value_ko !== original.value_ko || nextVal.value_en !== original.value_en;

    const nextModified = new Set(modifiedIds);
    if (isModified) nextModified.add(id);
    else nextModified.delete(id);
    setModifiedIds(nextModified);
  };

  const revertItem = (id: string) => {
    const original = originalContent.find(o => o.id === id);
    if (!original) return;
    setContent(prev => prev.map(item => item.id === id ? { ...original } : item));
    if (selectedItem?.id === id) setSelectedItem({ ...original });
    const nextModified = new Set(modifiedIds);
    nextModified.delete(id);
    setModifiedIds(nextModified);
  };

  const handleFileUpload = async (id: string, field: 'value_ko' | 'value_en', file: File) => {
    try {
      setUploading({ id, field });
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `site-assets/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      handleChange(id, field, publicUrl);
    } catch (error: any) {
      alert('업로드 에러: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  // Keyboard shortcuts: Cmd+S for save, ESC to exit editor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        if (selectedItem) {
            e.preventDefault();
            handleUpdate(selectedItem);
        } else if (modifiedIds.size > 0) {
            e.preventDefault();
            handleBatchUpdate(content.filter(i => modifiedIds.has(i.id)));
        }
      }
      if (e.key === 'Escape' && selectedItem) {
          setSelectedItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, handleUpdate, modifiedIds, content]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto font-pretendard h-[calc(100vh-120px)] flex flex-col relative overflow-hidden">
      
      {/* 1. MASTER VIEW (The Directory) */}
      <div className={`flex-1 flex flex-col gap-8 transition-all duration-500 ease-in-out ${selectedItem ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        {/* Header & Advanced Search/Filter */}
        <div className="flex flex-col gap-6 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                        <Layers className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                            {activeSection ? (
                            <>
                                <button onClick={() => setActiveSection(null)} className="hover:text-blue-600 transition-colors text-gray-400">콘텐츠 관리</button>
                                <ChevronRight className="w-5 h-5 text-gray-200" />
                                <span className="text-blue-600">{SECTIONS.find(s => s.id === activeSection)?.label}</span>
                            </>
                            ) : (
                            '콘텐츠 스튜디오'
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 font-medium mt-1">사이트의 모든 문구와 이미지를 체계적으로 관리합니다.</p>
                    </div>
                </div>

                <div className="relative w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                        type="text" 
                        placeholder="찾으시는 문구나 키워드를 입력하세요..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 shadow-inner"
                    />
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: 'all', label: '전체 보기' },
                        { id: 'missing', label: '미번역/누락' },
                        { id: 'image', label: '이미지' },
                    ].map((f) => (
                        <button
                            key={f.id}
                            onClick={() => setStatusFilter(f.id as any)}
                            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                statusFilter === f.id 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'
                            }`}
                        >
                            {f.label}
                            {f.id !== 'all' && <span className="ml-1.5 opacity-60">({getFilteredItems(activeSection, searchQuery, f.id).length})</span>}
                        </button>
                    ))}
                </div>

                {modifiedIds.size > 0 && (
                    <button
                        onClick={() => handleBatchUpdate(content.filter(i => modifiedIds.has(i.id)))}
                        className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-rose-200"
                    >
                        <Zap className="w-4 h-4" />
                        수정된 {modifiedIds.size}개 항목 모두 저장 (Cmd+S)
                    </button>
                )}
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {!activeSection && !searchQuery && statusFilter === 'all' ? (
                /* SECTION GRID */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
                    {SECTIONS.map((section) => {
                        const sectionItems = getFilteredItems(section.id, '', 'all');
                        const missingEn = sectionItems.filter(i => !i.value_en).length;
                        const completionRate = sectionItems.length > 0 ? Math.round(((sectionItems.length - missingEn) / sectionItems.length) * 100) : 0;
                        const Icon = section.icon;
                        
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className="group bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-xl transition-all text-left flex flex-col h-full relative overflow-hidden"
                            >
                                <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000" style={{ width: `${completionRate}%` }} />
                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{completionRate}% 완료</p>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{section.label}</h3>
                                    <p className="text-gray-500 text-sm mt-2 leading-relaxed font-medium line-clamp-2">{section.desc}</p>
                                </div>
                                <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                                    <span>{sectionItems.length} ITEMS</span>
                                    <ChevronRight className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </button>
                        );
                    })}
                </div>
            ) : (
                /* ITEM LIST */
                <div className="space-y-4 pb-10">
                    <div className="flex items-center gap-2 mb-6 ml-2">
                        <button onClick={() => {setActiveSection(null); setSearchQuery(''); setStatusFilter('all');}} className="text-gray-400 hover:text-blue-600 transition-colors font-bold text-sm">콘텐츠 스튜디오</button>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-sm font-black text-blue-600">결과 ({filteredContent.length})</span>
                    </div>

                    {filteredContent.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className={`w-full bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 hover:border-blue-500/30 hover:shadow-lg transition-all text-left flex items-center justify-between group ${modifiedIds.has(item.id) ? 'ring-2 ring-blue-500/10 border-blue-200' : ''}`}
                        >
                            <div className="flex items-center gap-6 min-w-0 flex-1">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isImageUrlKey(item.key) ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {isImageUrlKey(item.key) ? <ImageIcon size={20} /> : <FileText size={20} />}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <code className="text-xs font-black text-gray-400">{item.key}</code>
                                        {(!item.value_ko || !item.value_en) && (
                                            <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black uppercase">Missing</span>
                                        )}
                                        {modifiedIds.has(item.id) && (
                                            <span className="text-[9px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-black uppercase">Unsaved</span>
                                        )}
                                    </div>
                                    <p className="text-gray-800 dark:text-gray-200 font-bold truncate pr-10">{item.value_ko || <span className="text-gray-300 italic font-normal">비어있는 콘텐츠</span>}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">수정여부</p>
                                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400">{modifiedIds.has(item.id) ? '수정됨' : '저장됨'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                                    <ChevronRight size={20} />
                                </div>
                            </div>
                        </button>
                    ))}

                    {filteredContent.length === 0 && (
                        <div className="py-40 text-center bg-white dark:bg-gray-800 rounded-[3.5rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
                            <Search className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                            <p className="text-gray-400 text-lg font-bold">일치하는 콘텐츠를 찾을 수 없습니다.</p>
                            <button onClick={() => {setSearchQuery(''); setStatusFilter('all'); setActiveSection(null);}} className="mt-4 text-blue-600 font-bold hover:underline">모든 필터 초기화</button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>

      {/* 2. DETAIL VIEW (The Focused Editor) */}
      {selectedItem && (
        <div className="absolute inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col animate-in fade-in slide-in-from-right-10 duration-300">
            {/* Editor Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl text-gray-500 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            {selectedItem.key}
                            <button onClick={() => copyToClipboard(selectedItem.key)} className="text-gray-300 hover:text-blue-600 transition-colors">
                                <Copy size={16} />
                            </button>
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            {isImageUrlKey(selectedItem.key) ? (
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-black uppercase">Image Asset</span>
                            ) : (
                                <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase">Text Content</span>
                            )}
                            {modifiedIds.has(selectedItem.id) && (
                                <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-black uppercase">수정 중 (Unsaved)</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {modifiedIds.has(selectedItem.id) && (
                        <button
                            onClick={() => revertItem(selectedItem.id)}
                            className="px-6 py-3 text-gray-400 hover:text-gray-600 font-bold transition-colors"
                        >
                            원본으로 되돌리기
                        </button>
                    )}
                    <button
                        onClick={() => handleUpdate(selectedItem)}
                        disabled={saving === selectedItem.id}
                        className={`px-10 py-4 rounded-[1.25rem] font-black transition-all flex items-center gap-3 shadow-xl ${
                            saving === selectedItem.id 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-none'
                        }`}
                    >
                        {saving === selectedItem.id ? <CheckCircle2 size={20} /> : <Save size={20} />}
                        {saving === selectedItem.id ? '저장 완료' : '변경사항 저장'}
                    </button>
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="ml-2 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl text-gray-300 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-y-auto p-12 lg:p-20 flex justify-center">
                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 pb-20">
                    {/* KO FIELD */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-3 text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <span className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-200"></span> 
                                Korean Content
                                <span className="text-gray-200">|</span>
                                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] text-gray-500">{selectedItem.value_ko?.length || 0} characters</span>
                            </h4>
                            <button onClick={() => copyToClipboard(selectedItem.value_ko)} className="text-[11px] font-black text-blue-600 hover:underline uppercase">Copy Value</button>
                        </div>
                        
                        {isImageUrlKey(selectedItem.key) ? (
                            <ImageEditor 
                                value={selectedItem.value_ko} 
                                onChange={(val) => handleChange(selectedItem.id, 'value_ko', val)}
                                onUpload={(file) => handleFileUpload(selectedItem.id, 'value_ko', file)}
                                isUploading={uploading?.id === selectedItem.id && uploading?.field === 'value_ko'}
                            />
                        ) : (
                            <textarea
                                value={selectedItem.value_ko || ''}
                                onChange={(e) => handleChange(selectedItem.id, 'value_ko', e.target.value)}
                                className="w-full p-8 text-xl border-4 border-transparent bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl focus:border-blue-500/20 focus:ring-0 outline-none min-h-[400px] transition-all font-medium leading-relaxed"
                                placeholder="한국어 내용을 입력하세요..."
                            />
                        )}
                    </div>

                    {/* EN FIELD */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="flex items-center gap-3 text-[12px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-200"></span> 
                                English Translation
                                <span className="text-gray-200">|</span>
                                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px] text-gray-500">{selectedItem.value_en?.length || 0} characters</span>
                            </h4>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleChange(selectedItem.id, 'value_en', selectedItem.value_ko)}
                                    className="flex items-center gap-2 text-[11px] font-black text-indigo-600 hover:underline uppercase"
                                >
                                    <Languages size={14} /> Sync from KO
                                </button>
                                <button onClick={() => copyToClipboard(selectedItem.value_en)} className="text-[11px] font-black text-blue-600 hover:underline uppercase">Copy Value</button>
                            </div>
                        </div>
                        
                        {isImageUrlKey(selectedItem.key) ? (
                            <ImageEditor 
                                value={selectedItem.value_en} 
                                onChange={(val) => handleChange(selectedItem.id, 'value_en', val)}
                                onUpload={(file) => handleFileUpload(selectedItem.id, 'value_en', file)}
                                isUploading={uploading?.id === selectedItem.id && uploading?.field === 'value_en'}
                            />
                        ) : (
                            <textarea
                                value={selectedItem.value_en || ''}
                                onChange={(e) => handleChange(selectedItem.id, 'value_en', e.target.value)}
                                className="w-full p-8 text-xl border-4 border-transparent bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl focus:border-blue-500/20 focus:ring-0 outline-none min-h-[400px] transition-all font-medium leading-relaxed"
                                placeholder="Enter English translation here..."
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Floating Hint */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900/90 backdrop-blur-xl text-white px-8 py-3 rounded-2xl text-xs font-bold flex items-center gap-6 shadow-2xl z-[60]">
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="bg-white/20 px-2 py-1 rounded text-white">Cmd + S</span>
                    <span>저장</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <div className="flex items-center gap-2 text-gray-400">
                    <span className="bg-white/20 px-2 py-1 rounded text-white">ESC</span>
                    <span>나가기</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

interface ImageEditorProps {
  value: string;
  onChange: (val: string) => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const ImageEditor = ({ value, onChange, onUpload, isUploading }: ImageEditorProps) => (
  <div className="space-y-6">
    <div className="aspect-video bg-white dark:bg-gray-800 rounded-[3rem] overflow-hidden flex items-center justify-center border-4 border-dashed border-gray-100 dark:border-gray-700 group/img relative transition-all hover:border-blue-300 shadow-2xl">
      {value ? (
        <img src={value} className="max-h-full max-w-full object-contain p-8" alt="Preview" />
      ) : (
        <div className="flex flex-col items-center gap-4 text-gray-200">
            <ImageIcon size={48} />
            <span className="text-sm font-black uppercase tracking-[0.2em]">No Media Asset</span>
        </div>
      )}
      
      {isUploading && (
        <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center backdrop-blur-md z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest animate-pulse">Syncing to Cloud...</span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center gap-6 backdrop-blur-sm">
        <label className="cursor-pointer bg-white text-gray-900 px-8 py-4 rounded-[1.25rem] text-sm font-black hover:bg-gray-100 transition-all flex items-center gap-3 shadow-2xl hover:scale-105">
          <Upload size={20} />
          {value ? '파일 교체' : '파일 업로드'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file);
            }}
          />
        </label>
        {value && (
            <a href={value} target="_blank" rel="noreferrer" className="bg-white/20 hover:bg-white/30 text-white p-4 rounded-[1.25rem] transition-all backdrop-blur-xl">
                <ExternalLink size={24} />
            </a>
        )}
      </div>
    </div>
    
    <div className="relative group/url">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-8 pr-16 py-6 text-sm bg-white dark:bg-gray-800 border-4 border-transparent rounded-[1.5rem] shadow-xl outline-none focus:border-blue-500/20 transition-all font-mono"
        placeholder="https://cloud-storage.com/image.png"
      />
      <Globe className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/url:text-blue-500 transition-colors" />
    </div>
  </div>
);

export default Content;
