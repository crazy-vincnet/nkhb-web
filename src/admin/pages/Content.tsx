import { useEffect, useState, useMemo } from 'react';
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
  Settings
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{id: string, field: string} | null>(null);
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('content').select('*').order('key', { ascending: true });
    if (!error) setContent(data || []);
    setLoading(false);
  };

  const isImageUrlKey = (key: string) => {
    const k = key.toLowerCase();
    return k.includes('logo') || k.includes('image') || k.includes('url') || k.startsWith('image_');
  };

  const filteredItems = useMemo(() => {
    let items = content;
    if (searchQuery) {
        return items.filter(item => 
            (item.key || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.value_ko || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.value_en || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    const section = SECTIONS.find(s => s.id === activeTab);
    return items.filter(item => section?.pattern.some(p => item.key.toLowerCase().startsWith(p) || item.key.toLowerCase().includes(p)));
  }, [content, activeTab, searchQuery]);

  const handleUpdate = async (item: ContentItem) => {
    setSavingId(item.id);
    const { error } = await supabase.from('content').update({ value_ko: item.value_ko, value_en: item.value_en }).eq('id', item.id);
    if (!error) {
        setModifiedIds(prev => {
            const next = new Set(prev);
            next.delete(item.id);
            return next;
        });
        setTimeout(() => setSavingId(null), 1000);
    } else {
        alert('저장 실패: ' + error.message);
        setSavingId(null);
    }
  };

  const handleChange = (id: string, field: 'value_ko' | 'value_en', value: string) => {
    setContent(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    setModifiedIds(prev => new Set(prev).add(id));
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
    <div className="max-w-7xl mx-auto p-4 lg:p-8 font-pretendard">
      
      {/* Search & Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 sticky top-0 z-30">
        <div className="p-4 border-b border-gray-50 dark:border-gray-800 flex flex-col md:flex-row gap-4 justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">콘텐츠 관리</h1>
            <div className="relative w-full md:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" placeholder="빠른 검색..." value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-none rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
                />
            </div>
        </div>
        <div className="flex overflow-x-auto p-2 gap-1 custom-scrollbar">
            {SECTIONS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => {setActiveTab(tab.id); setSearchQuery('');}}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id && !searchQuery ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* Editor Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
            <div key={item.id} className={`bg-white dark:bg-gray-900 rounded-xl border p-5 transition-all ${modifiedIds.has(item.id) ? 'border-blue-300 ring-2 ring-blue-50' : 'border-gray-100 dark:border-gray-800 shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <code className="text-[11px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded uppercase">{item.key}</code>
                        {isImageUrlKey(item.key) && <span className="text-[9px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-black uppercase">Image</span>}
                        {modifiedIds.has(item.id) && <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-black uppercase animate-pulse">수정됨</span>}
                    </div>
                    <button
                        onClick={() => handleUpdate(item)}
                        disabled={savingId === item.id || !modifiedIds.has(item.id)}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${modifiedIds.has(item.id) ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' : 'text-gray-300 cursor-default'}`}
                    >
                        {savingId === item.id ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
                        {savingId === item.id ? '저장 중' : '저장'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-1">한국어 원문</label>
                        {isImageUrlKey(item.key) ? (
                            <ImageRow value={item.value_ko} onChange={(v: string) => handleChange(item.id, 'value_ko', v)} onUpload={(f: File) => handleFileUpload(item.id, 'value_ko', f)} isUploading={uploading?.id === item.id && uploading?.field === 'value_ko'} />
                        ) : (
                            <textarea
                                value={item.value_ko || ''} onChange={(e) => handleChange(item.id, 'value_ko', e.target.value)}
                                className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500/30 outline-none min-h-[100px] transition-all resize-none"
                            />
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">English Translation</label>
                            <button onClick={() => handleChange(item.id, 'value_en', item.value_ko)} className="text-[9px] font-black text-blue-600 hover:underline uppercase flex items-center gap-1"><Languages size={10} /> KO 복사</button>
                        </div>
                        {isImageUrlKey(item.key) ? (
                            <ImageRow value={item.value_en} onChange={(v: string) => handleChange(item.id, 'value_en', v)} onUpload={(f: File) => handleFileUpload(item.id, 'value_en', f)} isUploading={uploading?.id === item.id && uploading?.field === 'value_en'} />
                        ) : (
                            <textarea
                                value={item.value_en || ''} onChange={(e) => handleChange(item.id, 'value_en', e.target.value)}
                                className="w-full p-3 text-sm bg-gray-50 dark:bg-gray-800/50 border border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-800 focus:border-blue-500/30 outline-none min-h-[100px] transition-all resize-none"
                            />
                        )}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {filteredItems.length === 0 && <div className="py-40 text-center"><p className="text-gray-400 font-bold">항목이 없습니다.</p></div>}
    </div>
  );
};

const ImageRow = ({ value, onChange, onUpload, isUploading }: { value: string; onChange: (v: string) => void; onUpload: (f: File) => void; isUploading: boolean }) => (
  <div className="flex items-center gap-3">
    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 flex-shrink-0 flex items-center justify-center relative">
        {value ? <img src={value} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-200" />}
        {isUploading && <div className="absolute inset-0 bg-white/90 dark:bg-black/90 flex items-center justify-center"><div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>}
    </div>
    <div className="flex-1 space-y-2">
        <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-1.5 text-[11px] bg-gray-50 dark:bg-gray-800 border-none rounded-lg focus:ring-1 focus:ring-blue-500 font-mono" placeholder="이미지 URL..." />
        <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-[10px] font-bold text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-50"><Upload size={12} /> 파일 업로드 <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])} /></label>
    </div>
  </div>
);

export default Content;
