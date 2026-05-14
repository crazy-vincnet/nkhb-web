import { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Upload, 
  Search, 
  Layout, 
  Image as ImageIcon, 
  Globe, 
  Info, 
  Settings, 
  Radio, 
  Heart,
  Copy,
  Languages,
  ExternalLink,
  Zap,
  FileText,
  AlertCircle
} from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const SECTIONS = [
  { id: 'hero', label: '히어로 섹션', icon: Layout, pattern: ['hero_', 'image_hero'], desc: '메인 상단 비주얼 및 환영 메시지', link: '/#hero' },
  { id: 'background', label: '방송배경 (01)', icon: Info, pattern: ['background_', 'image_background'], desc: '방송 취지 및 설립 배경', link: '/#about' },
  { id: 'composition', label: '방송구성 (02)', icon: Radio, pattern: ['composition_', 'sample_', 'track'], desc: '라디오 프로그램 구성 및 샘플', link: '/#composition' },
  { id: 'effects', label: '기대효과 (03)', icon: Heart, pattern: ['effects_'], desc: '대북 방송의 긍정적 영향력', link: '/#effects' },
  { id: 'reach', label: '도달범위 (04)', icon: Globe, pattern: ['reach_', 'image_reach'], desc: '방송 송출 범위 및 청취자 현황', link: '/#reach' },
  { id: 'guide', label: '참여안내 (05)', icon: Info, pattern: ['guide_', 'letter_modal'], desc: '사연 보내기 및 참여 방법', link: '/#guide' },
  { id: 'support', label: '후원하기 (06)', icon: Heart, pattern: ['support_'], desc: '후원 안내 및 계좌 정보', link: '/#support' },
  { id: 'schedule', label: '방송시간 (07)', icon: Settings, pattern: ['schedule_'], desc: '방송 시간표 및 주파수 안내', link: '/#schedule' },
  { id: 'nav', label: '내비게이션/공통', icon: Globe, pattern: ['nav_', 'footer_', 'page_', 'alt_logo'], desc: '메뉴, 푸터 및 공통 문구', link: '/' },
  { id: 'about', label: 'NKFI 소개페이지', icon: Info, pattern: ['about_', 'image_about'], desc: '단체 소개 및 연혁 페이지', link: '/about' },
  { id: 'seo', label: 'SEO/메타데이터', icon: Search, pattern: ['meta_'], desc: '검색 엔진 및 공유 정보' },
];

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState(false);
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

  const currentSection = useMemo(() => SECTIONS.find(s => s.id === activeSectionId), [activeSectionId]);

  const filteredItems = useMemo(() => {
    let items = content;
    
    if (searchQuery) {
        return items.filter(item => 
            item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.value_ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.value_en?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (currentSection) {
        return items.filter(item => 
            currentSection.pattern.some(p => item.key.toLowerCase().startsWith(p) || item.key.toLowerCase().includes(p))
        );
    }

    return items;
  }, [content, activeSectionId, searchQuery, currentSection]);

  const handleBatchUpdate = async () => {
    if (modifiedIds.size === 0) return;
    setSaving(true);
    try {
      const updates = content
        .filter(item => modifiedIds.has(item.id))
        .map(item => ({
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
      alert('모든 변경사항이 성공적으로 저장되었습니다.');
    } catch (error: any) {
      alert('저장 실패: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (id: string, field: 'value_ko' | 'value_en', value: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));

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

  // Keyboard shortcut: Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleBatchUpdate();
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
    <div className="fixed inset-0 top-[72px] flex bg-gray-50 dark:bg-gray-950 font-pretendard overflow-hidden">
      
      {/* 1. SIDEBAR (Navigation) */}
      <aside className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                콘텐츠 스튜디오
            </h2>
            <div className="mt-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="항목 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSectionId === section.id && !searchQuery;
                const sectionItems = content.filter(item => section.pattern.some(p => item.key.toLowerCase().startsWith(p) || item.key.toLowerCase().includes(p)));
                const missingCount = sectionItems.filter(i => !i.value_en || !i.value_ko).length;
                const modifiedCount = sectionItems.filter(i => modifiedIds.has(i.id)).length;

                return (
                    <button
                        key={section.id}
                        onClick={() => {
                            setActiveSectionId(section.id);
                            setSearchQuery('');
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
                            isActive 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm ring-1 ring-blue-100 dark:ring-blue-900/50' 
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                            <span className={`text-sm font-bold ${isActive ? 'text-blue-700 dark:text-blue-300' : ''}`}>{section.label}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            {modifiedCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm" />}
                            {missingCount > 0 && (
                                <span className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-black rounded-md">{missingCount}</span>
                            )}
                        </div>
                    </button>
                );
            })}
        </nav>

        {modifiedIds.size > 0 && (
            <div className="p-6 bg-rose-50 dark:bg-rose-900/10 border-t border-rose-100 dark:border-rose-900/20">
                <button
                    onClick={handleBatchUpdate}
                    className="w-full py-3.5 bg-rose-600 text-white rounded-xl text-sm font-black shadow-lg shadow-rose-200 dark:shadow-none hover:bg-rose-700 transition-all flex items-center justify-center gap-2"
                >
                    <Zap className="w-4 h-4 fill-current" />
                    {modifiedIds.size}개 변경사항 저장
                </button>
            </div>
        )}
      </aside>

      {/* 2. MAIN PANEL (Editor) */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Main Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-10 py-6 flex items-center justify-between shrink-0">
            <div>
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                        {searchQuery ? '검색 결과' : currentSection?.label}
                    </h1>
                    {currentSection?.link && !searchQuery && (
                        <a 
                            href={currentSection.link} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                            <ExternalLink size={16} />
                        </a>
                    )}
                </div>
                <p className="text-sm text-gray-500 font-medium mt-1">
                    {searchQuery ? `"${searchQuery}"에 대한 ${filteredItems.length}개의 항목` : currentSection?.desc}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-gray-400">
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">Cmd + S</span>
                    <span>빠른 저장</span>
                </div>
                <button
                    onClick={handleBatchUpdate}
                    disabled={modifiedIds.size === 0 || saving}
                    className={`px-8 py-3.5 rounded-2xl text-sm font-black transition-all flex items-center gap-2 ${
                        modifiedIds.size > 0 
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200' 
                        : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                    }`}
                >
                    {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
                    저장하기
                </button>
            </div>
        </header>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-gray-50/50 dark:bg-gray-950/50">
            <div className="max-w-5xl mx-auto space-y-12">
                {filteredItems.map((item) => (
                    <div 
                        key={item.id} 
                        className={`bg-white dark:bg-gray-900 rounded-[2rem] border transition-all ${
                            modifiedIds.has(item.id) 
                            ? 'border-blue-400 ring-4 ring-blue-500/5 shadow-xl' 
                            : 'border-gray-200 dark:border-gray-800 shadow-sm'
                        }`}
                    >
                        {/* Field Header */}
                        <div className="px-8 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <code className="text-[11px] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                                    {item.key}
                                </code>
                                {isImageUrlKey(item.key) && (
                                    <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">Image</span>
                                )}
                                {(!item.value_ko || !item.value_en) && (
                                    <span className="flex items-center gap-1 text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                                        <AlertCircle size={10} /> 미완성
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => copyToClipboard(item.key)}
                                    className="p-2 text-gray-300 hover:text-blue-600 transition-colors"
                                    title="Key 복사"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Edit Area */}
                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* KO */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-red-500" /> 한국어 원문
                                    </h4>
                                    <span className="text-[10px] font-bold text-gray-300">{item.value_ko?.length || 0} 자</span>
                                </div>
                                {isImageUrlKey(item.key) ? (
                                    <ImageEditor 
                                        value={item.value_ko} 
                                        onChange={(val) => handleChange(item.id, 'value_ko', val)}
                                        onUpload={(file) => handleFileUpload(item.id, 'value_ko', file)}
                                        isUploading={uploading?.id === item.id && uploading?.field === 'value_ko'}
                                    />
                                ) : (
                                    <AutoResizeTextarea
                                        value={item.value_ko || ''}
                                        onChange={(val) => handleChange(item.id, 'value_ko', val)}
                                        placeholder="내용을 입력하세요..."
                                        isError={!item.value_ko}
                                    />
                                )}
                            </div>

                            {/* EN */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between px-1">
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" /> English
                                    </h4>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleChange(item.id, 'value_en', item.value_ko)}
                                            className="text-[9px] font-black text-indigo-600 hover:underline flex items-center gap-1 uppercase"
                                        >
                                            <Languages size={10} /> KO-To-EN
                                        </button>
                                        <span className="text-[10px] font-bold text-gray-300">{item.value_en?.length || 0} 자</span>
                                    </div>
                                </div>
                                {isImageUrlKey(item.key) ? (
                                    <ImageEditor 
                                        value={item.value_en} 
                                        onChange={(val) => handleChange(item.id, 'value_en', val)}
                                        onUpload={(file) => handleFileUpload(item.id, 'value_en', file)}
                                        isUploading={uploading?.id === item.id && uploading?.field === 'value_en'}
                                    />
                                ) : (
                                    <AutoResizeTextarea
                                        value={item.value_en || ''}
                                        onChange={(val) => handleChange(item.id, 'value_en', val)}
                                        placeholder="Enter translation..."
                                        isError={!item.value_en}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="py-40 text-center">
                        <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                        <p className="text-gray-400 text-lg font-bold">표시할 항목이 없습니다.</p>
                    </div>
                )}
                
                {/* Spacer for bottom */}
                <div className="h-20" />
            </div>
        </div>
      </main>
    </div>
  );
};

interface AutoResizeTextareaProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  isError: boolean;
}

const AutoResizeTextarea = ({ value, onChange, placeholder, isError }: AutoResizeTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full p-6 text-base border-2 ${isError ? 'border-amber-100 bg-amber-50/10' : 'border-gray-50 dark:border-gray-800'} dark:bg-gray-800 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none min-h-[120px] transition-all font-medium leading-relaxed resize-none`}
      placeholder={placeholder}
    />
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
    <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 group/img relative transition-all hover:border-blue-300">
      {value ? (
        <img src={value} className="max-h-full max-w-full object-contain p-4" alt="Preview" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-300">
            <ImageIcon size={32} />
            <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
        </div>
      )}
      
      {isUploading && (
        <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      )}

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center gap-3">
        <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-black hover:bg-gray-100 transition-all flex items-center gap-2">
          <Upload size={14} />
          교체
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
            <a href={value} target="_blank" rel="noreferrer" className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-all">
                <ExternalLink size={16} />
            </a>
        )}
      </div>
    </div>
    
    <div className="relative group/url">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-4 pr-10 py-3 text-[11px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500/20 transition-all font-mono"
        placeholder="이미지 URL"
      />
      <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
    </div>
  </div>
);

export default Content;
