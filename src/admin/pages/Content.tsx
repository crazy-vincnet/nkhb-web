import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Upload, 
  Search, 
  ChevronRight, 
  Layout, 
  Type, 
  Image as ImageIcon, 
  Globe, 
  Info, 
  Settings, 
  Radio, 
  Heart,
  AlertCircle,
  Sparkles,
  Layers,
  CheckCircle2,
  Copy,
  Filter,
  ArrowRight,
  Languages,
  ExternalLink,
  Zap,
  ArrowUpRight,
  Maximize2,
  Minimize2,
  Undo2
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
  { id: 'guide', label: '참여안내 (05)', icon: Type, pattern: ['guide_', 'letter_modal'], desc: '사연 보내기 및 참여 방법 안내', link: '/#guide' },
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
  const [saving, setSaving] = useState<string | null>(null);
  const [batchSaving, setBatchSaving] = useState<string | null>(null);
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

  const groupedContent = useMemo(() => {
    const groups: { [key: string]: ContentItem[] } = {};
    filteredContent.forEach(item => {
      const parts = item.key.split('_');
      const prefix = parts.length > 1 ? parts[0] : 'general';
      if (!groups[prefix]) groups[prefix] = [];
      groups[prefix].push(item);
    });
    return groups;
  }, [filteredContent]);

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
      // Update original content to match new value
      setOriginalContent(prev => prev.map(o => o.id === item.id ? { ...item } : o));
      const nextModified = new Set(modifiedIds);
      nextModified.delete(item.id);
      setModifiedIds(nextModified);
      setTimeout(() => setSaving(null), 1000);
    }
  };

  const handleBatchUpdate = async (items: ContentItem[], groupName: string) => {
    setBatchSaving(groupName);
    try {
      const updates = items.map(item => ({
        id: item.id,
        key: item.key,
        value_ko: item.value_ko,
        value_en: item.value_en
      }));

      const { error } = await supabase
        .from('content')
        .upsert(updates);

      if (error) throw error;
      
      const nextModified = new Set(modifiedIds);
      setOriginalContent(prev => {
        const next = [...prev];
        items.forEach(item => {
          const idx = next.findIndex(o => o.id === item.id);
          if (idx > -1) next[idx] = { ...item };
          setSaving(item.id);
          nextModified.delete(item.id);
        });
        return next;
      });
      setModifiedIds(nextModified);
      
      setTimeout(() => {
        setSaving(null);
        setBatchSaving(null);
      }, 1000);
    } catch (error: any) {
      alert('일괄 저장 실패: ' + error.message);
      setBatchSaving(null);
    }
  };

  const handleChange = (id: string, field: 'value_ko' | 'value_en', value: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
    
    // Check if truly modified from original
    const original = originalContent.find(o => o.id === id);
    const current = content.find(c => c.id === id);
    if (!original || !current) return;

    const nextVal = { ...current, [field]: value };
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

  // Keyboard shortcut Cmd/Ctrl + S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        // If there are modified IDs, save them all
        if (modifiedIds.size > 0) {
          handleBatchUpdate(content.filter(i => modifiedIds.has(i.id)), 'shortcut_batch');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modifiedIds, content]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-pretendard">
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
                    <button onClick={() => setActiveSection(null)} className="hover:text-blue-600 transition-colors">콘텐츠 관리</button>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                    <span className="text-blue-600">{SECTIONS.find(s => s.id === activeSection)?.label}</span>
                  </>
                ) : (
                  '콘텐츠 통합 관리'
                )}
              </h2>
              <p className="text-sm text-gray-500 font-medium mt-1">
                {activeSection ? SECTIONS.find(s => s.id === activeSection)?.desc : '섹션별로 분류된 사이트 문구와 이미지를 관리합니다.'}
              </p>
            </div>
          </div>

          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="문구 키워드 또는 내용 검색... (Cmd+S로 저장)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 shadow-inner"
            />
          </div>
        </div>

        {/* Filter Chips & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-50 dark:border-gray-700">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mr-2">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </div>
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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {f.label}
                {f.id !== 'all' && (
                  <span className="ml-2 opacity-60">
                    ({getFilteredItems(activeSection, searchQuery, f.id).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {modifiedIds.size > 0 && (
            <div className="flex items-center gap-3">
               <button
                onClick={() => modifiedIds.forEach(id => revertItem(id))}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold flex items-center gap-1.5"
              >
                <Undo2 className="w-3.5 h-3.5" /> 모두 되돌리기
              </button>
              <button
                onClick={() => handleBatchUpdate(content.filter(i => modifiedIds.has(i.id)), 'all_modified')}
                className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-rose-200 animate-pulse"
              >
                <Zap className="w-4 h-4" />
                {modifiedIds.size}개 항목 즉시 저장
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main View */}
      {!activeSection && !searchQuery && statusFilter === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section) => {
            const sectionItems = getFilteredItems(section.id, '', 'all');
            const missingEn = sectionItems.filter(i => !i.value_en).length;
            const completionRate = sectionItems.length > 0 ? Math.round(((sectionItems.length - missingEn) / sectionItems.length) * 100) : 0;
            const Icon = section.icon;
            
            return (
              <div key={section.id} className="group bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-xl transition-all flex flex-col h-full relative overflow-hidden">
                {/* Progress Background */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-1000 group-hover:h-2" 
                  style={{ width: `${completionRate}%` }}
                />

                <div className="p-8 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <button 
                      onClick={() => setActiveSection(section.id)}
                      className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{completionRate}% 완료</p>
                      {missingEn > 0 && (
                        <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-1 uppercase tracking-tighter">
                          {missingEn} 미번역
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 cursor-pointer" onClick={() => setActiveSection(section.id)}>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{section.label}</h3>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed font-medium line-clamp-2">{section.desc}</p>
                  </div>

                  <div className="mt-8 flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-6">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{sectionItems.length} 항목</span>
                      {section.link && (
                        <a 
                          href={section.link} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="라이브 사이트에서 섹션 확인"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <button 
                      onClick={() => setActiveSection(section.id)}
                      className="flex items-center gap-1 text-xs font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      편집하기 <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-20">
          {Object.entries(groupedContent).map(([prefix, items]) => (
            <div key={prefix} className="space-y-6">
              {/* Sticky Group Header */}
              <div className="sticky top-0 z-20 bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-md py-4 -mx-4 px-4 rounded-b-2xl border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 dark:shadow-none">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      {prefix === 'general' ? '기타 항목' : `${prefix} 그룹`}
                      <span className="text-xs font-bold text-gray-400 bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-100 dark:border-gray-700">{items.length}</span>
                    </h3>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {items.some(i => modifiedIds.has(i.id)) && (
                    <button
                      onClick={() => handleBatchUpdate(items.filter(i => modifiedIds.has(i.id)), prefix)}
                      disabled={batchSaving === prefix}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700"
                    >
                      {batchSaving === prefix ? <CheckCircle2 className="w-4 h-4 animate-bounce" /> : <Save className="w-4 h-4" />}
                      {batchSaving === prefix ? '저장 중...' : '이 그룹 일괄 저장'}
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {items.map((item) => (
                  <ContentCard 
                    key={item.id}
                    item={item}
                    isModified={modifiedIds.has(item.id)}
                    isSaving={saving === item.id}
                    searchQuery={searchQuery}
                    onUpdate={handleUpdate}
                    onChange={handleChange}
                    onRevert={revertItem}
                    onFileUpload={handleFileUpload}
                    isUploading={uploading?.id === item.id}
                    uploadField={uploading?.field}
                    isImageUrl={isImageUrlKey(item.key)}
                  />
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedContent).length === 0 && (
            <div className="py-40 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
              <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 text-lg font-bold">검색 결과가 없거나 항목이 비어있습니다.</p>
              <button 
                onClick={() => {setActiveSection(null); setSearchQuery(''); setStatusFilter('all');}}
                className="mt-4 text-blue-600 font-bold hover:underline"
              >
                필터 초기화하기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface ContentCardProps {
  item: ContentItem;
  isModified: boolean;
  isSaving: boolean;
  searchQuery: string;
  onUpdate: (item: ContentItem) => void;
  onChange: (id: string, field: 'value_ko' | 'value_en', value: string) => void;
  onRevert: (id: string) => void;
  onFileUpload: (id: string, field: 'value_ko' | 'value_en', file: File) => void;
  isUploading: boolean;
  uploadField?: string;
  isImageUrl: boolean;
}

const ContentCard = ({ 
  item, isModified, isSaving, searchQuery, onUpdate, onChange, onRevert, onFileUpload, isUploading, uploadField, isImageUrl 
}: ContentCardProps) => {
  const [isFullscreen, setIsFullscreen] = useState<'ko' | 'en' | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-white px-0.5 rounded font-bold">{part}</span> 
            : part
        )}
      </>
    );
  };

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-[2.5rem] border transition-all group/item ${
        isModified 
          ? 'border-blue-400 ring-4 ring-blue-500/5 shadow-2xl scale-[1.01]' 
          : 'border-gray-100 dark:border-gray-700 shadow-sm'
      }`}
    >
      <div className="px-8 py-5 bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <code className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl flex items-center gap-3">
              {highlightText(item.key, searchQuery)}
              <button 
                onClick={() => copyToClipboard(item.key)} 
                className="text-gray-400 hover:text-blue-600 transition-colors"
                title="Key 복사"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </code>
          </div>
          {isImageUrl && (
            <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full font-black tracking-widest uppercase">IMAGE</span>
          )}
          {(!item.value_ko || !item.value_en) && (
            <span className="flex items-center gap-1.5 text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black tracking-widest uppercase">
              <AlertCircle className="w-3.5 h-3.5" /> 미완성
            </span>
          )}
          {isModified && (
            <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-black tracking-widest uppercase">수정됨</span>
          )}
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {isModified && (
            <button
              onClick={() => onRevert(item.id)}
              className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="원래대로 되돌리기"
            >
              <Undo2 className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => onUpdate(item)}
            disabled={isSaving}
            className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 ${
              isSaving 
                ? 'bg-green-100 text-green-700' 
                : isModified
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
          >
            {isSaving ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaving ? '저장됨' : '저장'}
          </button>
        </div>
      </div>

      <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* KO Field */}
        <div className={`space-y-4 transition-all ${isFullscreen === 'ko' ? 'fixed inset-4 z-50 bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl overflow-y-auto' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-200"></span> 한국어 원문
              <span className="text-gray-300">|</span>
              <span className="bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px]">{item.value_ko?.length || 0}자</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsFullscreen(isFullscreen === 'ko' ? null : 'ko')}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title={isFullscreen === 'ko' ? "축소" : "크게 보기"}
              >
                {isFullscreen === 'ko' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={() => copyToClipboard(item.value_ko)} className="text-[10px] font-black text-blue-500 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-all uppercase">Copy</button>
            </div>
          </div>
          
          {isImageUrl ? (
            <ImageEditor 
              value={item.value_ko} 
              onChange={(val) => onChange(item.id, 'value_ko', val)}
              onUpload={(file) => onFileUpload(item.id, 'value_ko', file)}
              isUploading={isUploading && uploadField === 'value_ko'}
            />
          ) : (
            <AutoResizeTextarea
              value={item.value_ko || ''}
              onChange={(val) => onChange(item.id, 'value_ko', val)}
              placeholder="내용을 입력하세요..."
              isError={!item.value_ko}
              searchQuery={searchQuery}
            />
          )}
        </div>

        {/* EN Field */}
        <div className={`space-y-4 transition-all ${isFullscreen === 'en' ? 'fixed inset-4 z-50 bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl overflow-y-auto' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[11px] font-black text-gray-400 uppercase tracking-widest">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-200"></span> English Translation
              <span className="text-gray-300">|</span>
              <span className="bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded text-[10px]">{item.value_en?.length || 0}자</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsFullscreen(isFullscreen === 'en' ? null : 'en')}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                title={isFullscreen === 'en' ? "축소" : "크게 보기"}
              >
                {isFullscreen === 'en' ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button 
                className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg transition-all uppercase"
                onClick={() => onChange(item.id, 'value_en', item.value_ko)}
              >
                <Languages className="w-3.5 h-3.5" /> KO-To-EN
              </button>
              <button onClick={() => copyToClipboard(item.value_en)} className="text-[10px] font-black text-blue-500 hover:bg-blue-50 px-2.5 py-1 rounded-lg transition-all uppercase">Copy</button>
            </div>
          </div>
          
          {isImageUrl ? (
            <ImageEditor 
              value={item.value_en} 
              onChange={(val) => onChange(item.id, 'value_en', val)}
              onUpload={(file) => onFileUpload(item.id, 'value_en', file)}
              isUploading={isUploading && uploadField === 'value_en'}
            />
          ) : (
            <AutoResizeTextarea
              value={item.value_en || ''}
              onChange={(val) => onChange(item.id, 'value_en', val)}
              placeholder="Translation here..."
              isError={!item.value_en}
              searchQuery={searchQuery}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface AutoResizeTextareaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  isError: boolean;
  searchQuery: string;
}

const AutoResizeTextarea = ({ value, onChange, placeholder, isError, searchQuery }: AutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <span key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-gray-900 dark:text-white px-0.5 rounded font-bold">{part}</span> 
            : part
        )}
      </>
    );
  };

  return (
    <div className="relative group/field">
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full p-6 text-base border-2 ${isError ? 'border-amber-100 bg-amber-50/10' : 'border-gray-50 dark:border-gray-700'} dark:bg-gray-900 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none min-h-[140px] transition-all font-medium leading-relaxed resize-none`}
        placeholder={placeholder}
      />
      {searchQuery && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none p-6 text-base text-transparent whitespace-pre-wrap break-words font-medium leading-relaxed">
          {highlightText(value || '', searchQuery)}
        </div>
      )}
      <div className="absolute right-4 bottom-4 opacity-0 group-hover/field:opacity-100 transition-opacity">
        <ArrowUpRight className="w-5 h-5 text-gray-300" />
      </div>
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
  <div className="space-y-4">
    <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded-[2rem] overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-700 group/img relative transition-all hover:border-blue-300 hover:bg-gray-100/50">
      {value ? (
        <img src={value} className="max-h-full max-w-full object-contain p-4 transition-transform group-hover/img:scale-[1.02]" alt="Preview" />
      ) : (
        <div className="flex flex-col items-center gap-3 text-gray-300">
          <ImageIcon className="w-12 h-12" />
          <span className="text-sm font-black uppercase tracking-widest">No Image Asset</span>
        </div>
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest animate-pulse">Uploading to Cloud...</span>
        </div>
      )}
      {value && (
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center gap-4 backdrop-blur-[2px]">
          <label className="cursor-pointer bg-white text-gray-900 px-6 py-3 rounded-2xl text-xs font-black hover:bg-gray-100 transition-all flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95">
            <Upload className="w-4 h-4" />
            파일 교체
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
          <a href={value} target="_blank" rel="noreferrer" className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-2xl transition-all backdrop-blur-md">
            <ExternalLink size={18} />
          </a>
        </div>
      )}
    </div>
    {!value && (
      <label className="w-full cursor-pointer bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 px-4 py-4 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-800 transition-all flex items-center justify-center gap-3 text-sm font-black text-blue-600">
        <Upload className="w-5 h-5" />
        컴퓨터에서 자산 업로드
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
    )}
    <div className="relative group/url">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-6 pr-12 py-4 text-xs bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-mono"
        placeholder="Cloud URL 직접 입력"
      />
      <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within/url:text-blue-500 transition-colors" />
    </div>
  </div>
);

export default Content;
