import { useEffect, useState, useMemo, useRef } from 'react';
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
  RotateCcw,
  CheckCircle2,
  Layers,
  FileText,
  Copy
} from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const SECTIONS = [
  { 
    id: 'home', 
    label: '메인 페이지', 
    icon: Layout, 
    description: '홈페이지 메인 배너, 방송 소개, 후원 안내 등 모든 섹션',
    patterns: ['hero_', 'background_', 'composition_', 'sample_', 'track', 'effects_', 'reach_', 'guide_', 'support_', 'schedule_']
  },
  { 
    id: 'about', 
    label: 'NKFI 소개', 
    icon: Info, 
    description: '기관 미션, 비전, 사역 소개, 창립자 정보',
    patterns: ['about_']
  },
  { 
    id: 'common', 
    label: '공통/메뉴', 
    icon: Globe, 
    description: '네비게이션, 푸터, 로고, SNS 링크',
    patterns: ['nav_', 'footer_', 'logo', 'title', 'image_', 'alt_']
  },
  { 
    id: 'seo', 
    label: 'SEO', 
    icon: Search, 
    description: '검색 엔진 최적화 메타 정보',
    patterns: ['meta_']
  },
];

const GROUP_CONFIG: { [sectionId: string]: { label: string; patterns: string[] }[] } = {
  home: [
    { label: '히어로 (Main Banner)', patterns: ['hero_'] },
    { label: '방송 배경', patterns: ['background_'] },
    { label: '방송 구성', patterns: ['composition_'] },
    { label: '샘플 트랙', patterns: ['sample_', 'track'] },
    { label: '기대 효과', patterns: ['effects_'] },
    { label: '도달 범위', patterns: ['reach_'] },
    { label: '참여 안내', patterns: ['guide_'] },
    { label: '후원 안내', patterns: ['support_'] },
    { label: '방송 시간', patterns: ['schedule_'] },
  ],
  about: [
    { label: '소개 히어로', patterns: ['about_hero'] },
    { label: 'NKFI 소개 본문', patterns: ['about_intro'] },
    { label: '비전 및 사명', patterns: ['about_vision', 'about_mission'] },
    { label: '사역 안내', patterns: ['about_ministry'] },
    { label: '창립자 소개', patterns: ['about_founder'] },
    { label: '하단 CTA', patterns: ['about_cta'] },
  ],
  common: [
    { label: '네비게이션 메뉴', patterns: ['nav_'] },
    { label: '푸터 정보', patterns: ['footer_'] },
    { label: '로고 및 사이트 명칭', patterns: ['logo', 'title'] },
    { label: '이미지 에셋', patterns: ['image_', 'alt_'] },
  ],
  seo: [
    { label: '검색 엔진 최적화', patterns: ['meta_'] },
  ]
};

const KEY_LABELS: { [key: string]: string } = {
  // Hero
  'hero_title': '메인 타이틀',
  'hero_subtitle': '상단 슬로건',
  'hero_desc': '메인 설명 문구',
  'hero_button': '참여 버튼 텍스트',
  'image_hero': '메인 배경 이미지',
  
  // Background
  'background_title': '방송 배경 제목',
  'background_subtitle': '방송 배경 소제목',
  'background_desc_1': '설명 단락 1',
  'background_desc_2': '설명 단락 2',
  'image_background': '배경 이미지',

  // Reach
  'reach_title': '도달 범위 제목',
  'reach_desc': '도달 범위 설명',
  'reach_stats_1': '통계 항목 1',
  'reach_stats_2': '통계 항목 2',
  'image_reach': '지형/지도 이미지',

  // Support
  'support_title': '후원 안내 제목',
  'support_desc': '후원 감사 문구',
  'support_bank_name': '은행명',
  'support_bank_account': '계좌번호',
  'support_bank_owner': '예금주',

  // Nav/Common
  'nav_home': '메뉴: 홈',
  'nav_about': '메뉴: 소개',
  'nav_broadcast': '메뉴: 방송안내',
  'nav_support': '메뉴: 후원하기',
  'footer_address': '하단 주소',
  'footer_rights': '하단 저작권 문구',
  'image_logo': '사이트 로고 이미지',
  'alt_logo': '로고 대체 텍스트',

  // SEO
  'meta_title': '사이트 제목 (SEO)',
  'meta_desc': '사이트 설명 (SEO)',
  'meta_keywords': '검색 키워드',
};

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
        let items = data || [];
        
        // Ensure essential keys exist in the list even if not in DB
        const essentialKeys = ['image_logo'];
        essentialKeys.forEach(key => {
          if (!items.find(i => i.key === key)) {
            items.push({
              id: `missing-${key}`,
              key: key,
              value_ko: '',
              value_en: ''
            });
          }
        });

        setContent(items);
        setOriginalContent(JSON.parse(JSON.stringify(items)));
    }
    setLoading(false);
  };

  const isImageUrlKey = (key: string) => {
    const k = key.toLowerCase();
    return k.includes('logo') || k.includes('image') || k.includes('url') || k.startsWith('image_');
  };

  const getLabel = (key: string) => KEY_LABELS[key] || key.split('_').join(' ').toUpperCase();

  const filteredItemsByStatus = useMemo(() => {
    let items = content;
    if (statusFilter === 'missing') items = items.filter(i => !i.value_en || !i.value_ko);
    else if (statusFilter === 'modified') items = items.filter(i => modifiedIds.has(i.id));
    return items;
  }, [content, statusFilter, modifiedIds]);

  const groupedItems = useMemo(() => {
    const section = SECTIONS.find(s => s.id === activeTab);
    const sectionPatterns = section?.patterns || [];
    
    // Filter items belonging to this section
    const sectionItems = filteredItemsByStatus.filter(item => 
      sectionPatterns.some(p => item.key.toLowerCase().includes(p.toLowerCase()))
    );

    const config = GROUP_CONFIG[activeTab] || [];
    const usedIds = new Set<string>();

    const groups = config.map(group => {
      const items = sectionItems.filter(item => 
        group.patterns.some(p => item.key.toLowerCase().includes(p.toLowerCase())) &&
        (searchQuery === '' || 
         item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
         (item.value_ko || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
         (item.value_en || '').toLowerCase().includes(searchQuery.toLowerCase()))
      );
      items.forEach(i => usedIds.add(i.id));
      return { ...group, items };
    });

    // Add "Miscellaneous" group for items in section but not in any specific group
    const miscItems = sectionItems.filter(item => 
      !usedIds.has(item.id) &&
      (searchQuery === '' || 
       item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (item.value_ko || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
       (item.value_en || '').toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (miscItems.length > 0) {
      groups.push({ label: '기타 항목', patterns: [], items: miscItems });
    }

    return groups.filter(g => g.items.length > 0);
  }, [filteredItemsByStatus, activeTab, searchQuery]);

  const handleUpdate = async (item: ContentItem) => {
    setSavingId(item.id);
    
    const payload = { value_ko: item.value_ko, value_en: item.value_en };
    let error;

    if (item.id.startsWith('missing-')) {
      // Create new record
      const { error: insertError } = await supabase.from('content').insert([{
        key: item.key,
        ...payload
      }]);
      error = insertError;
    } else {
      // Update existing record
      const { error: updateError } = await supabase.from('content').update(payload).eq('id', item.id);
      error = updateError;
    }

    if (!error) {
        // Refresh to get real IDs
        await fetchContent();
        setModifiedIds(prev => {
            const next = new Set(prev);
            next.delete(item.id);
            return next;
        });
        setSavingId(item.id); // Show success briefly
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
        const inserts = itemsToUpdate.filter(i => i.id.startsWith('missing-')).map(i => ({ key: i.key, value_ko: i.value_ko, value_en: i.value_en }));
        const updates = itemsToUpdate.filter(i => !i.id.startsWith('missing-')).map(item => ({ id: item.id, key: item.key, value_ko: item.value_ko, value_en: item.value_en }));
        
        if (inserts.length > 0) {
          const { error } = await supabase.from('content').insert(inserts);
          if (error) throw error;
        }
        if (updates.length > 0) {
          const { error } = await supabase.from('content').upsert(updates);
          if (error) throw error;
        }
        
        await fetchContent();
        setModifiedIds(new Set());
        alert('저장되었습니다.');
    } catch (error: any) {
        alert('실패: ' + error.message);
    } finally {
        setBatchSaving(false);
    }
  };

  const handleChange = (id: string, field: 'value_ko' | 'value_en', value: string) => {
    setContent(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
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

  const revertAll = () => {
    setContent(JSON.parse(JSON.stringify(originalContent)));
    setModifiedIds(new Set());
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
    <div className="flex flex-col font-pretendard -m-8">
      
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 py-6 flex flex-col xl:flex-row gap-6 justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Content Center</h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Logical Grouping & Labels</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                <div className="relative flex-1 xl:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" placeholder="항목 내용 또는 키워드 검색..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border-none rounded-[1.25rem] text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                </div>
                <div className="flex bg-gray-50 dark:bg-gray-800 p-1.5 rounded-[1.25rem] gap-1">
                    {[{ id: 'all', label: '전체' }, { id: 'missing', label: '누락' }, { id: 'modified', label: '수정됨' }].map(f => (
                        <button key={f.id} onClick={() => setStatusFilter(f.id as any)} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${statusFilter === f.id ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}>{f.label}</button>
                    ))}
                </div>
                <button
                    onClick={handleBatchUpdate}
                    disabled={modifiedIds.size === 0 || batchSaving}
                    className={`px-8 py-3.5 rounded-[1.25rem] text-sm font-black transition-all shadow-2xl ${modifiedIds.size > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
                >
                    {batchSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    <span className="ml-2">{modifiedIds.size > 0 ? `${modifiedIds.size}개 저장하기` : '저장할 내용 없음'}</span>
                </button>
            </div>
        </div>
        <div className="max-w-[1400px] mx-auto px-8 flex overflow-x-auto pb-3 gap-2 custom-scrollbar">
            {SECTIONS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => {setActiveTab(tab.id); setSearchQuery('');}}
                    className={`flex-shrink-0 flex flex-col items-center gap-1 min-w-[100px] p-3 rounded-2xl transition-all ${activeTab === tab.id && !searchQuery ? 'bg-gray-100 dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'}`}
                >
                    <tab.icon size={18} className={activeTab === tab.id ? 'text-blue-600' : 'text-gray-300'} />
                    <span className={`text-[11px] font-black uppercase tracking-tighter ${activeTab === tab.id ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>{tab.label}</span>
                </button>
            ))}
        </div>
      </div>

      {/* Workspace */}
      <div className="max-w-[1400px] mx-auto px-8 w-full py-12 space-y-12 pb-40">
        {groupedItems.map((group, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="px-10 py-6 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">{group.label}</h3>
                    <span className="text-[11px] font-black text-gray-400 bg-white dark:bg-gray-900 px-3 py-1 rounded-full shadow-sm">{group.items.length} 항목</span>
                </div>

                <div className="p-10 space-y-12">
                    {group.items.map((item) => (
                        <div 
                            key={item.id} 
                            className={`transition-all ${
                                modifiedIds.has(item.id) 
                                ? 'ring-4 ring-blue-500/5 rounded-3xl p-6 -m-6 bg-blue-50/30 dark:bg-blue-900/10' 
                                : ''
                            }`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl ${isImageUrlKey(item.key) ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {isImageUrlKey(item.key) ? <ImageIcon size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-800 dark:text-gray-100">{getLabel(item.key)}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <code className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">{item.key}</code>
                                            <button 
                                                onClick={() => {navigator.clipboard.writeText(item.key);}}
                                                className="p-1 text-gray-300 hover:text-blue-600 transition-colors"
                                                title="Key 복사"
                                            >
                                                <Copy size={10} />
                                            </button>
                                        </div>
                                    </div>
                                    {(!item.value_en || !item.value_ko) && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-black rounded-full uppercase">번역 필요</span>}
                                </div>
                                <div className="flex items-center gap-3">
                                    {modifiedIds.has(item.id) && (
                                        <button onClick={() => revertItem(item.id)} className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="원래대로 되돌리기"><RotateCcw size={18} /></button>
                                    )}
                                    <button
                                        onClick={() => handleUpdate(item)}
                                        disabled={savingId === item.id || !modifiedIds.has(item.id)}
                                        className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${modifiedIds.has(item.id) ? 'bg-gray-900 text-white hover:bg-black shadow-lg' : 'bg-gray-50 text-gray-300'}`}
                                    >
                                        {savingId === item.id ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Save size={16} />}
                                        <span className="ml-2">{savingId === item.id ? '저장됨' : '저장'}</span>
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                {isImageUrlKey(item.key) ? (
                                    <>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" /> KOREAN
                                            </label>
                                            <ImageRow value={item.value_ko} onChange={(v: string) => handleChange(item.id, 'value_ko', v)} onUpload={(f: File) => handleFileUpload(item.id, 'value_ko', f)} isUploading={uploading?.id === item.id && uploading?.field === 'value_ko'} />
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center px-1">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" /> ENGLISH
                                                </label>
                                                <button onClick={() => handleChange(item.id, 'value_en', item.value_ko)} className="text-[9px] font-black text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-all uppercase flex items-center gap-1"><Languages size={10} /> Sync from KO</button>
                                            </div>
                                            <ImageRow value={item.value_en} onChange={(v: string) => handleChange(item.id, 'value_en', v)} onUpload={(f: File) => handleFileUpload(item.id, 'value_en', f)} isUploading={uploading?.id === item.id && uploading?.field === 'value_en'} />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <ContentField 
                                            item={item} 
                                            lang="ko" 
                                            onChange={(id: string, val: string) => handleChange(id, 'value_ko', val)} 
                                        />
                                        <ContentField 
                                            item={item} 
                                            lang="en" 
                                            onChange={(id: string, val: string) => handleChange(id, 'value_en', val)} 
                                            onSync={() => handleChange(item.id, 'value_en', item.value_ko)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        ))}
      </div>

      {groupedItems.length === 0 && (
        <div className="py-40 text-center bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
            <Search className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <p className="text-gray-400 text-lg font-bold">표시할 항목이 없습니다.</p>
        </div>
      )}

      {/* Floating Save Bar */}
      {modifiedIds.size > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-10 py-5 rounded-[2rem] shadow-2xl flex items-center gap-12 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col">
             <span className="text-xs font-black uppercase tracking-widest text-gray-400">UNSAVED CHANGES</span>
             <span className="text-sm font-bold">{modifiedIds.size}개의 변경사항이 있습니다.</span>
          </div>
          <div className="flex gap-4">
            <button onClick={revertAll} className="px-6 py-2.5 text-sm font-black text-gray-400 hover:text-white dark:hover:text-black transition-colors">되돌리기</button>
            <button onClick={handleBatchUpdate} disabled={batchSaving} className="px-10 py-3 bg-[#E67E5F] rounded-2xl text-sm font-black hover:bg-[#D46B4E] transition-all shadow-lg shadow-[#E67E5F]/20">
              {batchSaving ? '저장 중...' : '모두 저장하기'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const ContentField = ({ item, lang, onChange, onSync }: any) => {
  const isLink = item.key.toLowerCase().includes('url') || item.key.toLowerCase().includes('link');
  const value = lang === 'ko' ? item.value_ko : item.value_en;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
        <span className={`w-1.5 h-1.5 rounded-full ${lang === 'ko' ? 'bg-[#E67E5F]' : 'bg-blue-500'}`} />
        {lang === 'ko' ? 'KOREAN' : 'ENGLISH'}
        {lang === 'en' && onSync && (
          <button onClick={onSync} className="ml-2 text-[9px] font-black text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-all uppercase flex items-center gap-1">
            <Languages size={10} /> Sync from KO
          </button>
        )}
        <span className="ml-auto text-gray-300 flex items-center gap-1">
           {isLink ? <Globe size={10} /> : <FileText size={10} />}
           {isLink ? 'Link' : 'Text'}
        </span>
      </div>
      <div className="relative group">
        {isLink ? (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(item.id, e.target.value)}
            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-mono focus:ring-2 focus:ring-[#E67E5F]/20 focus:border-[#E67E5F] outline-none transition-all"
            placeholder={lang === 'ko' ? 'https://... 또는 /path' : 'Enter URL or path...'}
          />
        ) : (
          <AutoResizeTextarea
            value={value || ''}
            onChange={(e: any) => onChange(item.id, e.target.value)}
            className="w-full px-5 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm focus:ring-2 focus:ring-[#E67E5F]/20 focus:border-[#E67E5F] outline-none transition-all min-h-[100px] resize-none leading-relaxed"
            placeholder={lang === 'ko' ? '내용을 입력하세요...' : 'Enter content...'}
          />
        )}
      </div>
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
    <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-[1.5rem] overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-700 group/img relative transition-all hover:border-blue-300 shadow-sm">
        {value ? <img src={value} className="max-h-full max-w-full object-contain p-4 transition-transform group-hover/img:scale-105" /> : <ImageIcon size={32} className="text-gray-200" />}
        {isUploading && <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center gap-3">
            <label className="cursor-pointer bg-white text-gray-900 px-5 py-2 rounded-xl text-xs font-black hover:bg-gray-100 transition-all flex items-center gap-2"><Upload size={14} /> 교체<input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} /></label>
            {value && <a href={value} target="_blank" rel="noreferrer" className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-xl transition-all font-bold text-xs"><ImageIcon size={14} /></a>}
        </div>
    </div>
    <div className="relative group/url"><input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full pl-4 pr-10 py-3 text-[11px] bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-1 focus:ring-blue-500 font-mono transition-all" placeholder="이미지 URL..." /><Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-focus-within/url:text-blue-500 transition-colors" /></div>
  </div>
);

export default Content;
