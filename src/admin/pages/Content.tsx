import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Upload, Search, ChevronRight, Layout, Type, Image as ImageIcon, Globe, Info, Settings, Radio, Heart } from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const SECTIONS = [
  { id: 'all', label: '전체 보기', icon: Layout },
  { id: 'nav', label: '네비게이션/공통', icon: Globe, pattern: ['nav_', 'footer_', 'page_', 'alt_logo'] },
  { id: 'hero', label: '히어로 섹션', icon: Layout, pattern: ['hero_', 'image_hero'] },
  { id: 'background', label: '방송배경 (01)', icon: Info, pattern: ['background_', 'image_background'] },
  { id: 'composition', label: '방송구성 (02)', icon: Radio, pattern: ['composition_', 'sample_', 'track'] },
  { id: 'effects', label: '기대효과 (03)', icon: Heart, pattern: ['effects_'] },
  { id: 'reach', label: '도달범위 (04)', icon: Globe, pattern: ['reach_', 'image_reach'] },
  { id: 'guide', label: '참여안내 (05)', icon: Type, pattern: ['guide_', 'letter_modal'] },
  { id: 'support', label: '후원하기 (06)', icon: Heart, pattern: ['support_'] },
  { id: 'schedule', label: '방송시간 (07)', icon: Settings, pattern: ['schedule_'] },
  { id: 'about', label: 'NKFI 소개페이지', icon: Info, pattern: ['about_', 'image_about'] },
  { id: 'seo', label: 'SEO/메타데이터', icon: Search, pattern: ['meta_'] },
];

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
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

  const filteredContent = useMemo(() => {
    let result = content;

    // Search filter
    if (searchQuery) {
      result = result.filter(item => 
        (item.key?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.value_ko?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (item.value_en?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      );
    }

    // Section filter
    if (activeSection !== 'all') {
      const section = SECTIONS.find(s => s.id === activeSection);
      if (section?.pattern) {
        result = result.filter(item => 
          section.pattern?.some(p => (item.key?.toLowerCase() || '').startsWith(p) || (item.key?.toLowerCase() || '').includes(p))
        );
      }
    }

    return result;
  }, [content, activeSection, searchQuery]);

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
      // Show a temporary success state
      setTimeout(() => setSaving(null), 500);
    }
  };

  const handleChange = (id: string, field: 'value_ko' | 'value_en', value: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
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

  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg">
      {/* Sidebar - Sections */}
      <div className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 flex flex-col shrink-0">
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Layout className="w-5 h-5 text-blue-600" />
            콘텐츠 관리
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  {section.label}
                </div>
                {activeSection === section.id && <ChevronRight className="w-4 h-4" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-800">
        {/* Toolbar */}
        <div className="p-4 border-b dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white dark:bg-gray-800 z-10">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="항목 키 또는 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            항목 수: <span className="text-blue-600 font-bold">{filteredContent.length}</span>
          </div>
        </div>

        {/* Scrollable List */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto space-y-6">
              {filteredContent.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden group">
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
                        {item.key}
                      </code>
                      {isImageUrlKey(item.key) && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold">IMAGE</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleUpdate(item)}
                      disabled={saving === item.id}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                        saving === item.id 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
                      }`}
                    >
                      <Save className="w-3.5 h-3.5" />
                      {saving === item.id ? '저장됨' : '변경사항 저장'}
                    </button>
                  </div>

                  <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* KO Field */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-red-500"></span> 한국어
                      </div>
                      {isImageUrlKey(item.key) ? (
                        <ImageEditor 
                          value={item.value_ko} 
                          onChange={(val) => handleChange(item.id, 'value_ko', val)}
                          onUpload={(file) => handleFileUpload(item.id, 'value_ko', file)}
                          isUploading={uploading?.id === item.id && uploading?.field === 'value_ko'}
                        />
                      ) : (
                        <textarea
                          value={item.value_ko || ''}
                          onChange={(e) => handleChange(item.id, 'value_ko', e.target.value)}
                          className="w-full p-3 text-sm border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                        />
                      )}
                    </div>

                    {/* EN Field */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> ENGLISH
                      </div>
                      {isImageUrlKey(item.key) ? (
                        <ImageEditor 
                          value={item.value_en} 
                          onChange={(val) => handleChange(item.id, 'value_en', val)}
                          onUpload={(file) => handleFileUpload(item.id, 'value_en', file)}
                          isUploading={uploading?.id === item.id && uploading?.field === 'value_en'}
                        />
                      ) : (
                        <textarea
                          value={item.value_en || ''}
                          onChange={(e) => handleChange(item.id, 'value_en', e.target.value)}
                          className="w-full p-3 text-sm border dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
  <div className="space-y-3">
    <div className="aspect-video bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 group/img relative">
      {value ? (
        <img src={value} className="max-h-full max-w-full object-contain" alt="Preview" />
      ) : (
        <ImageIcon className="w-8 h-8 text-gray-300" />
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mb-2"></div>
          <span className="text-[10px] font-bold text-blue-600">업로드 중...</span>
        </div>
      )}
    </div>
    <div className="flex gap-2">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1.5 text-xs border dark:border-gray-600 dark:bg-gray-700 rounded-lg outline-none"
        placeholder="이미지 URL 직접 입력"
      />
      <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg border dark:border-gray-600 transition-colors flex items-center shrink-0">
        <Upload className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
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
    </div>
  </div>
);

export default Content;
