import { useEffect, useState, useMemo } from 'react';
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
  CheckCircle2
} from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const SECTIONS = [
  { id: 'nav', label: '네비게이션/공통', icon: Globe, pattern: ['nav_', 'footer_', 'page_', 'alt_logo'], desc: '메뉴, 푸터, 로고 및 사이트 전역에서 사용되는 공통 문구' },
  { id: 'hero', label: '히어로 섹션', icon: Layout, pattern: ['hero_', 'image_hero'], desc: '메인 페이지 상단 비주얼 및 환영 메시지' },
  { id: 'background', label: '방송배경 (01)', icon: Info, pattern: ['background_', 'image_background'], desc: '방송 취지 및 설립 배경 섹션' },
  { id: 'composition', label: '방송구성 (02)', icon: Radio, pattern: ['composition_', 'sample_', 'track'], desc: '라디오 프로그램 구성 및 샘플 듣기' },
  { id: 'effects', label: '기대효과 (03)', icon: Heart, pattern: ['effects_'], desc: '대북 방송의 긍정적 영향력 설명' },
  { id: 'reach', label: '도달범위 (04)', icon: Globe, pattern: ['reach_', 'image_reach'], desc: '방송 송출 범위 및 청취자 현황' },
  { id: 'guide', label: '참여안내 (05)', icon: Type, pattern: ['guide_', 'letter_modal'], desc: '사연 보내기 및 참여 방법 안내' },
  { id: 'support', label: '후원하기 (06)', icon: Heart, pattern: ['support_'], desc: '후원 안내 및 계좌 정보' },
  { id: 'schedule', label: '방송시간 (07)', icon: Settings, pattern: ['schedule_'], desc: '방송 시간표 및 주파수 안내' },
  { id: 'about', label: 'NKFI 소개페이지', icon: Info, pattern: ['about_', 'image_about'], desc: '단체 소개 및 연혁 페이지 콘텐츠' },
  { id: 'seo', label: 'SEO/메타데이터', icon: Search, pattern: ['meta_'], desc: '검색 엔진 최적화 및 공유 시 미리보기 정보' },
];

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);
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

  const getFilteredItems = (sectionId: string | null, search: string) => {
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

    return result;
  };

  const filteredContent = useMemo(() => getFilteredItems(activeSection, searchQuery), [content, activeSection, searchQuery]);

  // Group items by their prefix (e.g., hero_title, hero_desc -> hero group)
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
      setTimeout(() => setSaving(null), 1000);
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

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 font-pretendard">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
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
            placeholder="어떤 문구나 키워드를 찾으시나요? (예: hero_title)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
        </div>
      </div>

      {/* Main View: Section Cards OR Filtered Content */}
      {!activeSection && !searchQuery ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const sectionItems = getFilteredItems(section.id, '');
            const missingEn = sectionItems.filter(i => !i.value_en).length;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="group bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 hover:border-blue-500/50 hover:shadow-xl transition-all text-left flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  {missingEn > 0 && (
                    <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                      <AlertCircle className="w-3 h-3" />
                      {missingEn} 미번역
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{section.label}</h3>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed font-medium line-clamp-2">{section.desc}</p>
                </div>
                <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                  <span>{sectionItems.length} ITEMS</span>
                  <div className="flex items-center gap-1 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    관리하기 <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(groupedContent).map(([prefix, items]) => (
            <div key={prefix} className="space-y-6">
              <div className="flex items-center gap-3 ml-2">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  {prefix === 'general' ? '기타 항목' : `${prefix} 그룹`}
                </h3>
                <div className="h-px flex-1 bg-gray-100 dark:bg-gray-800 ml-2" />
              </div>

              <div className="grid grid-cols-1 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group">
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <code className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg">
                          {item.key}
                        </code>
                        {isImageUrlKey(item.key) && (
                          <span className="text-[10px] bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">IMAGE</span>
                        )}
                        {(!item.value_ko || !item.value_en) && (
                          <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black tracking-widest uppercase">
                            <AlertCircle className="w-3 h-3" />
                            미완성
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleUpdate(item)}
                        disabled={saving === item.id}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${
                          saving === item.id 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200 dark:shadow-none'
                        }`}
                      >
                        {saving === item.id ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        {saving === item.id ? '저장 완료' : '변경사항 저장'}
                      </button>
                    </div>

                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* KO Field */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-200"></span> 한국어
                          </div>
                          {!item.value_ko && <span className="text-[10px] font-bold text-red-500">내용 없음</span>}
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
                            className={`w-full p-4 text-sm border-2 ${!item.value_ko ? 'border-red-100 bg-red-50/10' : 'border-gray-50 dark:border-gray-700'} dark:bg-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[120px] transition-all font-medium`}
                            placeholder="한국어 내용을 입력하세요..."
                          />
                        )}
                      </div>

                      {/* EN Field */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-sm shadow-blue-200"></span> English
                          </div>
                          {!item.value_en && <span className="text-[10px] font-bold text-amber-500">번역 필요</span>}
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
                            className={`w-full p-4 text-sm border-2 ${!item.value_en ? 'border-amber-100 bg-amber-50/10' : 'border-gray-50 dark:border-gray-700'} dark:bg-gray-900 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[120px] transition-all font-medium`}
                            placeholder="English translation here..."
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(groupedContent).length === 0 && (
            <div className="py-40 text-center bg-white dark:bg-gray-800 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-700">
              <Search className="w-16 h-16 text-gray-200 mx-auto mb-6" />
              <p className="text-gray-400 text-lg font-bold">검색 결과가 없거나 항목이 비어있습니다.</p>
              <button 
                onClick={() => {setActiveSection(null); setSearchQuery('');}}
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

interface ImageEditorProps {
  value: string;
  onChange: (val: string) => void;
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const ImageEditor = ({ value, onChange, onUpload, isUploading }: ImageEditorProps) => (
  <div className="space-y-4">
    <div className="aspect-video bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center border-2 border-dashed border-gray-100 dark:border-gray-700 group/img relative transition-colors hover:border-blue-200">
      {value ? (
        <img src={value} className="max-h-full max-w-full object-contain" alt="Preview" />
      ) : (
        <div className="flex flex-col items-center gap-2 text-gray-300">
          <ImageIcon className="w-10 h-10" />
          <span className="text-xs font-bold">이미지 없음</span>
        </div>
      )}
      {isUploading && (
        <div className="absolute inset-0 bg-white/90 dark:bg-black/90 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Uploading...</span>
        </div>
      )}
      {value && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
          <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-xl">
            <Upload className="w-4 h-4" />
            이미지 교체
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
      )}
    </div>
    {!value && (
      <label className="w-full cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 px-4 py-3 rounded-xl border-2 border-transparent transition-all flex items-center justify-center gap-2 text-sm font-bold text-gray-500">
        <Upload className="w-4 h-4" />
        컴퓨터에서 파일 업로드
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
    <div className="relative group">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-4 pr-10 py-3 text-xs bg-gray-50 dark:bg-gray-900 border-2 border-gray-50 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
        placeholder="또는 이미지 URL 주소 직접 입력"
      />
      <Globe className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
    </div>
  </div>
);

export default Content;
