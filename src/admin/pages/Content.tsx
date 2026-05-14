import { useEffect, useState, useMemo } from 'react';
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
  X,
  CheckCircle2
} from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const SECTIONS = [
  { id: 'all', label: '전체 보기', icon: Layers },
  { id: 'hero', label: '히어로', icon: Layout, pattern: ['hero_', 'image_hero'] },
  { id: 'background', label: '방송배경', icon: Info, pattern: ['background_', 'image_background'] },
  { id: 'composition', label: '방송구성', icon: Radio, pattern: ['composition_', 'sample_', 'track'] },
  { id: 'effects', label: '기대효과', icon: Heart, pattern: ['effects_'] },
  { id: 'reach', label: '도달범위', icon: Globe, pattern: ['reach_', 'image_reach'] },
  { id: 'guide', label: '참여안내', icon: Info, pattern: ['guide_', 'letter_modal'] },
  { id: 'support', label: '후원하기', icon: Heart, pattern: ['support_'] },
  { id: 'nav', label: '공통/메뉴', icon: Globe, pattern: ['nav_', 'footer_', 'page_', 'alt_logo'] },
  { id: 'seo', label: 'SEO', icon: Search, pattern: ['meta_'] },
];

function Layers(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{id: string, field: string} | null>(null);

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
    }
    setLoading(false);
  };

  const isImageUrlKey = (key: string) => {
    const k = key.toLowerCase();
    return k.includes('logo') || k.includes('image') || k.includes('url') || k.startsWith('image_');
  };

  const filteredItems = useMemo(() => {
    let items = content;
    
    if (searchQuery) {
        items = items.filter(item => 
            item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.value_ko.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.value_en?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    } else if (activeTab !== 'all') {
        const section = SECTIONS.find(s => s.id === activeTab);
        if (section?.pattern) {
            items = items.filter(item => 
                section.pattern.some(p => item.key.toLowerCase().startsWith(p) || item.key.toLowerCase().includes(p))
            );
        }
    }

    return items;
  }, [content, activeTab, searchQuery]);

  const handleUpdate = async (item: ContentItem) => {
    setSaving(true);
    const { error } = await supabase
      .from('content')
      .update({ 
        value_ko: item.value_ko, 
        value_en: item.value_en 
      })
      .eq('id', item.id);

    if (error) {
      alert('저장 실패: ' + error.message);
    } else {
      setContent(prev => prev.map(o => o.id === item.id ? { ...item } : o));
      setTimeout(() => {
          setSaving(false);
          setSelectedItem(null);
      }, 500);
    }
  };

  const handleFieldChange = (field: 'value_ko' | 'value_en', value: string) => {
    if (!selectedItem) return;
    setSelectedItem({ ...selectedItem, [field]: value });
  };

  const handleFileUpload = async (field: 'value_ko' | 'value_en', file: File) => {
    if (!selectedItem) return;
    try {
      setUploading({ id: selectedItem.id, field });
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

      handleFieldChange(field, publicUrl);
    } catch (error: any) {
      alert('업로드 에러: ' + error.message);
    } finally {
      setUploading(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto p-6 lg:p-10 font-pretendard min-h-screen">
      
      {/* 1. TOP HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
        <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Content Studio</h1>
            <p className="text-gray-500 font-medium mt-1">사이트의 모든 시각적, 텍스트 요소를 한눈에 관리하세요.</p>
        </div>
        <div className="relative w-full md:max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
                type="text" 
                placeholder="어떤 콘텐츠를 찾으시나요?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white dark:bg-gray-900 border-none rounded-[1.5rem] shadow-xl shadow-blue-500/5 focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium"
            />
        </div>
      </div>

      {/* 2. NAVIGATION PILLS */}
      <div className="flex flex-wrap items-center gap-2 mb-10 overflow-x-auto pb-4 custom-scrollbar">
        {SECTIONS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
                <button
                    key={tab.id}
                    onClick={() => {setActiveTab(tab.id); setSearchQuery('');}}
                    className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                        isActive 
                        ? 'bg-gray-900 text-white shadow-xl dark:bg-blue-600' 
                        : 'bg-white dark:bg-gray-800 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                    }`}
                >
                    <Icon size={16} />
                    {tab.label}
                </button>
            );
        })}
      </div>

      {/* 3. VISUAL CARD GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {filteredItems.map((item) => {
            const isImg = isImageUrlKey(item.key);
            return (
                <div 
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-blue-500/30 hover:shadow-2xl transition-all cursor-pointer flex flex-col h-full active:scale-95"
                >
                    {/* Visual Preview */}
                    <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-800 relative overflow-hidden flex items-center justify-center border-b border-gray-50 dark:border-gray-800">
                        {isImg ? (
                            item.value_ko ? (
                                <img src={item.value_ko} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                            ) : (
                                <ImageIcon size={48} className="text-gray-200" />
                            )
                        ) : (
                            <div className="p-8 w-full">
                                <p className="text-gray-900 dark:text-gray-100 text-lg font-bold leading-relaxed line-clamp-4">
                                    {item.value_ko || <span className="text-gray-300 italic font-normal">비어있는 문구</span>}
                                </p>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                        <div className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                            <Settings size={18} className="text-blue-600" />
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="p-8 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <code className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg uppercase tracking-wider">
                                {item.key}
                            </code>
                            {(!item.value_en || !item.value_ko) && (
                                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-lg shadow-amber-200" />
                            )}
                        </div>
                        <p className="text-gray-400 text-xs font-medium line-clamp-2 leading-relaxed">
                            {item.value_en || 'English translation needed'}
                        </p>
                    </div>
                </div>
            );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-40 text-center">
            <Search className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <p className="text-gray-400 text-lg font-bold">일치하는 항목이 없습니다.</p>
        </div>
      )}

      {/* 4. SLIDE-OVER EDITOR PANEL */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${selectedItem ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
        
        {/* Panel */}
        <div className={`absolute inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-500 ease-out transform ${selectedItem ? 'translate-x-0' : 'translate-x-full'}`}>
            {selectedItem && (
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="px-10 py-8 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                {selectedItem.key}
                                <button onClick={() => {navigator.clipboard.writeText(selectedItem.key);}} className="text-gray-300 hover:text-blue-600 transition-colors"><Copy size={18} /></button>
                            </h2>
                            <p className="text-sm text-gray-400 font-medium mt-1">콘텐츠 상세 편집</p>
                        </div>
                        <button onClick={() => setSelectedItem(null)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Scrollable Form */}
                    <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">
                        {/* KO FIELD */}
                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> 한국어 원문
                            </label>
                            {isImageUrlKey(selectedItem.key) ? (
                                <ImageUploader 
                                    value={selectedItem.value_ko} 
                                    onChange={(v) => handleFieldChange('value_ko', v)}
                                    onUpload={(f) => handleFileUpload('value_ko', f)}
                                    isUploading={uploading?.id === selectedItem.id && uploading?.field === 'value_ko'}
                                />
                            ) : (
                                <textarea
                                    value={selectedItem.value_ko || ''}
                                    onChange={(e) => handleFieldChange('value_ko', e.target.value)}
                                    className="w-full p-8 text-xl border-4 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-[2rem] focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500/20 focus:ring-0 outline-none min-h-[250px] transition-all font-medium leading-relaxed resize-none"
                                    placeholder="한국어 내용을 입력하세요..."
                                />
                            )}
                        </div>

                        {/* EN FIELD */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> English Translation
                                </label>
                                <button 
                                    onClick={() => handleFieldChange('value_en', selectedItem.value_ko)}
                                    className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:underline uppercase"
                                >
                                    <Languages size={14} /> Sync from KO
                                </button>
                            </div>
                            {isImageUrlKey(selectedItem.key) ? (
                                <ImageUploader 
                                    value={selectedItem.value_en} 
                                    onChange={(v) => handleFieldChange('value_en', v)}
                                    onUpload={(f) => handleFileUpload('value_en', f)}
                                    isUploading={uploading?.id === selectedItem.id && uploading?.field === 'value_en'}
                                />
                            ) : (
                                <textarea
                                    value={selectedItem.value_en || ''}
                                    onChange={(e) => handleFieldChange('value_en', e.target.value)}
                                    className="w-full p-8 text-xl border-4 border-gray-50 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-[2rem] focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500/20 focus:ring-0 outline-none min-h-[250px] transition-all font-medium leading-relaxed resize-none"
                                    placeholder="Enter English translation..."
                                />
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-10 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                        <button
                            onClick={() => handleUpdate(selectedItem)}
                            disabled={saving}
                            className={`w-full py-5 rounded-[1.5rem] font-black transition-all flex items-center justify-center gap-3 shadow-2xl ${
                                saving 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                            }`}
                        >
                            {saving ? <CheckCircle2 size={24} /> : <Save size={24} />}
                            {saving ? '수정 사항 반영 중...' : '변경사항 저장하기'}
                        </button>
                        <p className="text-center text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest">NKHB Content Studio v3.0</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

interface ImageUploaderProps {
  value: string;
  onChange: (val: string) => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const ImageUploader = ({ value, onChange, onUpload, isUploading }: ImageUploaderProps) => (
  <div className="space-y-4">
    <div className="aspect-video bg-gray-50 dark:bg-gray-800 rounded-[2rem] overflow-hidden flex items-center justify-center border-4 border-dashed border-gray-200 dark:border-gray-700 group/img relative transition-all hover:border-blue-300">
      {value ? (
        <img src={value} className="w-full h-full object-cover transition-transform group-hover/img:scale-105" alt="Preview" />
      ) : (
        <div className="flex flex-col items-center gap-3 text-gray-200">
            <ImageIcon size={48} />
            <span className="text-[10px] font-black uppercase tracking-widest">No Image Asset</span>
        </div>
      )}
      
      {isUploading && (
        <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center backdrop-blur-sm z-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      )}

      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-all flex items-center justify-center gap-4">
        <label className="cursor-pointer bg-white text-gray-900 px-6 py-3 rounded-[1.25rem] text-xs font-black hover:bg-gray-100 transition-all flex items-center gap-2">
          <Upload size={16} />
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
            <a href={value} target="_blank" rel="noreferrer" className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-[1.25rem] transition-all">
                <ExternalLink size={20} />
            </a>
        )}
      </div>
    </div>
    
    <div className="relative group/url">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-6 pr-12 py-5 text-xs bg-gray-50/50 dark:bg-gray-800/50 border-2 border-transparent rounded-[1.25rem] outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500/10 transition-all font-mono"
        placeholder="이미지 직접 URL (https://...)"
      />
      <Globe className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
    </div>
  </div>
);

export default Content;
