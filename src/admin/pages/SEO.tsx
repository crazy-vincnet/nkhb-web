import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Search, 
  Globe, 
  Image as ImageIcon, 
  Layout, 
  ShieldAlert,
  Share2,
  Eye,
  Trash2,
  AlertCircle
} from 'lucide-react';

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
  meta_robots: string;
  canonical_url: string;
  twitter_card: string;
  is_orphan?: boolean;
}

interface SiteSettings {
    key: string;
    value_ko: string;
    value_en: string;
}

const SEOAdmin = () => {
  const [settings, setSettings] = useState<SEOSettings[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'global'>('main');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [
        { data: seoData },
        { data: siteData },
        { data: pagesData },
        { data: postsData }
    ] = await Promise.all([
        supabase.from('seo_settings').select('*').order('page_slug'),
        supabase.from('sites_settings').select('*'),
        supabase.from('pages').select('slug'),
        supabase.from('nkhb_posts').select('slug')
    ]);
    
    if (seoData) {
      const pageSlugs = new Set((pagesData || []).map(p => p.slug));
      const postSlugs = new Set((postsData || []).map(p => `posts/${p.slug}`));
      
      // System slugs & base routes
      pageSlugs.add('home');
      pageSlugs.add('about');
      pageSlugs.add('posts');
      pageSlugs.add('audio');
      pageSlugs.add('schedule');

      const processedSEO = seoData.map(item => {
        const isOrphan = !pageSlugs.has(item.page_slug) && !postSlugs.has(item.page_slug);
        return {
          ...item,
          is_orphan: isOrphan
        };
      });
      setSettings(processedSEO);
    }
    if (siteData) setSiteSettings(siteData);
    setLoading(false);
  };

  const handleRemoveSEO = async (id: string) => {
    if (!window.confirm('이 SEO 설정을 영구적으로 삭제하시겠습니까? (연결된 페이지가 없는 경우 추천)')) return;
    
    const { error } = await supabase.from('seo_settings').delete().eq('id', id);
    if (!error) {
        setSettings(prev => prev.filter(s => s.id !== id));
    } else {
        alert('삭제 실패: ' + error.message);
    }
  };

  const handleUpdateSEO = async (item: SEOSettings) => {
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
        meta_robots: item.meta_robots,
        canonical_url: item.canonical_url,
        twitter_card: item.twitter_card,
        updated_at: new Date().toISOString()
      })
      .eq('id', item.id);

    if (error) alert('저장 실패: ' + error.message);
    setSaving(null);
  };

  const handleUpdateSite = async (key: string, value_ko: string, value_en: string) => {
    setSaving(key);
    const { error } = await supabase
        .from('sites_settings')
        .upsert({ key, value_ko, value_en, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    
    if (error) alert('저장 실패: ' + error.message);
    setSaving(null);
  };

  const handleChange = (id: string, field: keyof SEOSettings, value: string) => {
    setSettings(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 font-pretendard">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-pretendard pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3 text-gray-900 dark:text-white tracking-tight">
            <Search className="w-8 h-8 text-blue-600" />
            SEO 마스터 센터
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-medium">웹사이트의 검색 엔진 노출과 소셜 공유 최적화를 정밀하게 관리합니다.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-2xl">
            <button 
                onClick={() => setActiveTab('main')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'main' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-400'}`}
            >
                페이지별 설정
            </button>
            <button 
                onClick={() => setActiveTab('global')}
                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${activeTab === 'global' ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm' : 'text-gray-400'}`}
            >
                전역 사이트 설정
            </button>
        </div>
      </div>

      {activeTab === 'global' ? (
        <div className="grid grid-cols-1 gap-6">
            {['site_name', 'default_og_image', 'google_site_verification', 'naver_site_verification'].map(key => {
                const setting = siteSettings.find(s => s.key === key) || { key, value_ko: '', value_en: '' };
                const isVerificationKey = key.includes('verification');
                
                return (
                    <div key={key} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                        <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
                            <h3 className="font-bold text-lg uppercase tracking-wider text-blue-600">
                                {key.replace(/_/g, ' ')}
                            </h3>
                            <button 
                                onClick={() => handleUpdateSite(key, setting.value_ko, setting.value_en)}
                                disabled={saving === key}
                                className="px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black disabled:opacity-50"
                            >
                                {saving === key ? '저장 중...' : '설정 저장'}
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase">
                                    {isVerificationKey ? 'Verification Code (Common)' : 'Korean Value'}
                                </label>
                                <input 
                                    type="text"
                                    value={setting.value_ko}
                                    placeholder={isVerificationKey ? 'Enter verification code here...' : ''}
                                    onChange={(e) => setSiteSettings(prev => {
                                        const exists = prev.find(s => s.key === key);
                                        if (exists) return prev.map(s => s.key === key ? { ...s, value_ko: e.target.value } : s);
                                        return [...prev, { key, value_ko: e.target.value, value_en: '' }];
                                    })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                />
                            </div>
                            {!isVerificationKey && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase">English Value</label>
                                    <input 
                                        type="text"
                                        value={setting.value_en}
                                        onChange={(e) => setSiteSettings(prev => {
                                            const exists = prev.find(s => s.key === key);
                                            if (exists) return prev.map(s => s.key === key ? { ...s, value_en: e.target.value } : s);
                                            return [...prev, { key, value_ko: '', value_en: e.target.value }];
                                        })}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                                    />
                                </div>
                            )}
                            {isVerificationKey && (
                                <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mr-3 shrink-0" />
                                    <p className="text-[11px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                                        웹마스터 도구에서 제공받은 메타 태그의 <strong>content</strong> 속성값만 입력하세요.<br/>
                                        예: 구글(google-site-verification), 네이버(naver-site-verification)
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      ) : (
        <div className="space-y-8">
            {settings.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden group hover:shadow-xl hover:border-blue-100 transition-all duration-500">
                    <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100 dark:shadow-none">
                                <Layout className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-black text-xl tracking-tight text-gray-900 dark:text-white uppercase">/{item.page_slug}</h3>
                                {item.is_orphan ? (
                                    <div className="flex items-center gap-1.5 text-red-500 font-bold text-[10px] mt-0.5 animate-pulse">
                                        <AlertCircle size={10} /> 연결된 페이지 없음
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Individual Page SEO</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {item.is_orphan && (
                                <button
                                    onClick={() => handleRemoveSEO(item.id)}
                                    className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                                    title="불필요한 SEO 설정 삭제"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                            <button
                                onClick={() => handleUpdateSEO(item)}
                                disabled={saving === item.id}
                                className={`px-8 py-3 rounded-2xl text-sm font-black transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 ${
                                    saving === item.id ? 'bg-green-100 text-green-700' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                                }`}
                            >
                                <Save className="w-4 h-4" />
                                {saving === item.id ? '저장 중...' : '페이지 SEO 저장'}
                            </button>
                        </div>
                    </div>

                    <div className="p-8 space-y-10">
                        {/* Title & Description */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-xs font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-lg w-fit">
                                    <Globe className="w-3.5 h-3.5" /> KOREAN SEO
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 ml-1">브라우저 제목 (Title)</label>
                                        <input 
                                            type="text"
                                            value={item.title_ko || ''}
                                            onChange={(e) => handleChange(item.id, 'title_ko', e.target.value)}
                                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 ml-1">메타 설명 (Description)</label>
                                        <textarea 
                                            value={item.description_ko || ''}
                                            onChange={(e) => handleChange(item.id, 'description_ko', e.target.value)}
                                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] text-sm leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-2 text-xs font-black text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg w-fit">
                                    <Globe className="w-3.5 h-3.5" /> ENGLISH SEO
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 ml-1">Browser Title</label>
                                        <input 
                                            type="text"
                                            value={item.title_en || ''}
                                            onChange={(e) => handleChange(item.id, 'title_en', e.target.value)}
                                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-900 dark:text-white"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-gray-400 ml-1">Meta Description</label>
                                        <textarea 
                                            value={item.description_en || ''}
                                            onChange={(e) => handleChange(item.id, 'description_en', e.target.value)}
                                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px] text-sm leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Advanced Settings */}
                        <div className="pt-10 border-t dark:border-gray-700">
                            <div className="flex items-center gap-2 text-[10px] font-black text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg w-fit mb-8">
                                <ShieldAlert className="w-3.5 h-3.5" /> ADVANCED CONFIGURATION
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1">검색 로봇 설정 (Robots)</label>
                                    <select 
                                        value={item.meta_robots || 'index, follow'}
                                        onChange={(e) => handleChange(item.id, 'meta_robots', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none font-bold text-sm"
                                    >
                                        <option value="index, follow">수집 허용 (Index, Follow)</option>
                                        <option value="noindex, nofollow">수집 차단 (NoIndex, NoFollow)</option>
                                        <option value="index, nofollow">링크 제외 (Index, NoFollow)</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1">대표 URL (Canonical)</label>
                                    <input 
                                        type="text"
                                        value={item.canonical_url || ''}
                                        onChange={(e) => handleChange(item.id, 'canonical_url', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none font-mono text-xs"
                                        placeholder="https://nkhb.org/..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1">트위터 카드 타입</label>
                                    <select 
                                        value={item.twitter_card || 'summary_large_image'}
                                        onChange={(e) => handleChange(item.id, 'twitter_card', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none font-bold text-sm"
                                    >
                                        <option value="summary">기본형 (Summary)</option>
                                        <option value="summary_large_image">대형 이미지 (Large Image)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* OG Image */}
                        <div className="pt-10 border-t dark:border-gray-700">
                             <div className="flex items-center gap-2 text-[10px] font-black text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg w-fit mb-8">
                                <Share2 className="w-3.5 h-3.5" /> SOCIAL SHARING PREVIEW
                            </div>
                            <div className="flex flex-col lg:flex-row gap-10">
                                <div className="flex-1 space-y-4">
                                    <label className="text-[10px] font-bold text-gray-400 ml-1">공유 이미지 URL</label>
                                    <input 
                                        type="text"
                                        value={item.og_image_url || ''}
                                        onChange={(e) => handleChange(item.id, 'og_image_url', e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-xl outline-none font-mono text-xs"
                                    />
                                    <p className="text-[10px] text-gray-400 italic">이미지 권장 사이즈: 1200 x 630 px</p>
                                </div>
                                <div className="w-full lg:w-80 h-44 bg-gray-100 dark:bg-gray-900 rounded-3xl overflow-hidden border dark:border-gray-700 flex items-center justify-center relative group">
                                    {item.og_image_url ? (
                                        <>
                                            <img src={item.og_image_url} className="w-full h-full object-cover" alt="OG Preview" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Eye className="text-white w-8 h-8" />
                                            </div>
                                        </>
                                    ) : (
                                        <ImageIcon className="text-gray-300 w-12 h-12" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default SEOAdmin;
