import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Search, Globe, Image as ImageIcon, Layout, Type } from 'lucide-react';

interface SEOSettings {
  id: string;
  page_slug: string;
  title_ko: string;
  title_en: string;
  description_ko: string;
  description_en: string;
  keywords_ko: string;
  keywords_en: string;
  og_image_url: string;
}

const SEOAdmin = () => {
  const [settings, setSettings] = useState<SEOSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*')
      .order('page_slug', { ascending: true });

    if (error) {
      console.error('Error fetching SEO settings:', error);
    } else {
      setSettings(data || []);
    }
    setLoading(false);
  };

  const handleUpdate = async (item: SEOSettings) => {
    setSaving(item.id);
    const { error } = await supabase
      .from('seo_settings')
      .update({ 
        title_ko: item.title_ko,
        title_en: item.title_en,
        description_ko: item.description_ko,
        description_en: item.description_en,
        keywords_ko: item.keywords_ko,
        keywords_en: item.keywords_en,
        og_image_url: item.og_image_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.id);

    if (error) {
      alert('저장 실패: ' + error.message);
    } else {
      setTimeout(() => setSaving(null), 500);
    }
  };

  const handleChange = (id: string, field: keyof SEOSettings, value: string) => {
    setSettings(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-600" />
            SEO 및 검색 최적화
          </h2>
          <p className="text-gray-500 text-sm mt-1">각 페이지별 검색 엔진 최적화 및 소셜 공유 설정을 관리합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {settings.map((item) => (
          <div key={item.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                  <Layout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg uppercase tracking-tight">{item.page_slug} Page</h3>
                </div>
              </div>
              <button
                onClick={() => handleUpdate(item)}
                disabled={saving === item.id}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  saving === item.id 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Save className="w-4 h-4" />
                {saving === item.id ? '저장됨' : '설정 저장'}
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Title & Description Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Korean SEO */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-red-600">
                    <Globe className="w-4 h-4" /> 한국어 SEO
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">페이지 제목 (Title Tag)</label>
                    <input 
                      type="text"
                      value={item.title_ko || ''}
                      onChange={(e) => handleChange(item.id, 'title_ko', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="검색 결과에 표시될 제목"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">메타 설명 (Description)</label>
                    <textarea 
                      value={item.description_ko || ''}
                      onChange={(e) => handleChange(item.id, 'description_ko', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                      placeholder="검색 결과에 표시될 설명 (160자 내외 권장)"
                    />
                  </div>
                </div>

                {/* English SEO */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600">
                    <Globe className="w-4 h-4" /> English SEO
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Page Title</label>
                    <input 
                      type="text"
                      value={item.title_en || ''}
                      onChange={(e) => handleChange(item.id, 'title_en', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Title displayed in search results"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Meta Description</label>
                    <textarea 
                      value={item.description_en || ''}
                      onChange={(e) => handleChange(item.id, 'description_en', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                      placeholder="Description displayed in search results"
                    />
                  </div>
                </div>
              </div>

              {/* Shared Settings */}
              <div className="pt-6 border-t dark:border-gray-700 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-600">
                    <ImageIcon className="w-4 h-4" /> 소셜 공유 이미지 (Open Graph Image)
                  </div>
                  <div className="space-y-3">
                    <div className="aspect-[1.91/1] w-full bg-gray-100 dark:bg-gray-900 rounded-2xl border-2 border-dashed dark:border-gray-700 flex items-center justify-center overflow-hidden">
                      {item.og_image_url ? (
                        <img src={item.og_image_url} className="w-full h-full object-cover" alt="OG Preview" />
                      ) : (
                        <div className="text-center p-4">
                          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                          <p className="text-xs text-gray-400">권장 사이즈: 1200 x 630 px</p>
                        </div>
                      )}
                    </div>
                    <input 
                      type="text"
                      value={item.og_image_url || ''}
                      onChange={(e) => handleChange(item.id, 'og_image_url', e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl text-xs font-mono"
                      placeholder="이미지 URL (Content 메뉴에서 업로드 후 링크 복사 가능)"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-green-600">
                    <Type className="w-4 h-4" /> 키워드 (Keywords - 선택사항)
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">한국어 키워드 (쉼표로 구분)</label>
                      <input 
                        type="text"
                        value={item.keywords_ko || ''}
                        onChange={(e) => handleChange(item.id, 'keywords_ko', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none"
                        placeholder="북한, 라디오, 희망방송..."
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">English Keywords (comma separated)</label>
                      <input 
                        type="text"
                        value={item.keywords_en || ''}
                        onChange={(e) => handleChange(item.id, 'keywords_en', e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none"
                        placeholder="North Korea, Radio, Hope..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SEOAdmin;
