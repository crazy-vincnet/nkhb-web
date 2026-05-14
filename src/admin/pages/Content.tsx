import React, { useEffect, useState, useMemo, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Search, 
  Globe, 
  Languages,
  RotateCcw,
  CheckCircle2,
  Copy,
  Layout as LayoutIcon,
  ChevronRight,
  Info,
  Radio,
  Heart,
  Settings,
  Mail,
  Users,
  MessageSquare,
  HelpCircle,
  FileText
} from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const SECTIONS = [
  { id: 'layout', label: '레이아웃' },
  { id: 'nav', label: 'Nav' },
  { id: 'hero', label: 'Hero', description: '메인 배너 제목, 설명, 버튼, 통계' },
  { id: 'about', label: 'About' },
  { id: 'ministry', label: '사역' },
  { id: 'newsletter', label: '뉴스레터' },
  { id: 'join', label: 'Join' },
  { id: 'support', label: '후원' },
  { id: 'contact', label: '연락처' },
  { id: 'footer', label: '푸터' },
];

const SECTION_PATTERNS: { [key: string]: string[] } = {
  layout: ['layout_'],
  nav: ['nav_'],
  hero: ['hero_'],
  about: ['about_'],
  ministry: ['ministry_', '사역_'],
  newsletter: ['newsletter_'],
  join: ['join_'],
  support: ['support_'],
  contact: ['contact_'],
  footer: ['footer_'],
};

const KEY_LABELS: { [key: string]: string } = {
  'hero_top_label': '상단 레이블',
  'hero_title_1': '제목 1',
  'hero_title_2': '제목 2 (강조)',
  'hero_title_3': '제목 3 (이어지는 텍스트)',
  'hero_description': '설명',
  'hero_button_1_text': '버튼 1 텍스트',
  'hero_button_1_link': '버튼 1 링크',
  'hero_title': '메인 타이틀',
  'hero_subtitle': '상단 슬로건',
  'hero_desc': '메인 설명 문구',
  'hero_button': '참여 버튼 텍스트',
};

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [originalContent, setOriginalContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hero');
  const [lang, setLang] = useState<'ko' | 'en'>('ko');
  const [saving, setSaving] = useState(false);
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('content').select('*').order('key', { ascending: true });
    if (!error) {
        const items = data || [];
        setContent(items);
        setOriginalContent(JSON.parse(JSON.stringify(items)));
    }
    setLoading(false);
  };

  const filteredItems = useMemo(() => {
    const patterns = SECTION_PATTERNS[activeTab] || [];
    return content.filter(item => 
      patterns.some(p => item.key.toLowerCase().startsWith(p))
    );
  }, [content, activeTab]);

  const handleChange = (id: string, value: string) => {
    const field = lang === 'ko' ? 'value_ko' : 'value_en';
    setContent(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    
    const original = originalContent.find(o => o.id === id);
    if (!original) return;
    
    setModifiedIds(prev => {
      const next = new Set(prev);
      const currentItem = content.find(c => c.id === id);
      const isModified = (lang === 'ko' ? value : currentItem?.value_ko) !== original.value_ko || 
                         (lang === 'en' ? value : currentItem?.value_en) !== original.value_en;
      
      if (isModified) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleBatchUpdate = async () => {
    const itemsToUpdate = content.filter(i => modifiedIds.has(i.id));
    if (itemsToUpdate.length === 0) return;
    
    setSaving(true);
    try {
        const { error } = await supabase.from('content').upsert(
          itemsToUpdate.map(item => ({
            id: item.id,
            key: item.key,
            value_ko: item.value_ko,
            value_en: item.value_en
          }))
        );
        if (error) throw error;
        
        setOriginalContent(JSON.parse(JSON.stringify(content)));
        setModifiedIds(new Set());
        alert('저장되었습니다.');
    } catch (error: any) {
        alert('저장 실패: ' + error.message);
    } finally {
        setSaving(false);
    }
  };

  const revertAll = () => {
    setContent(JSON.parse(JSON.stringify(originalContent)));
    setModifiedIds(new Set());
  };

  const copyToEnglish = () => {
    if (confirm('현재 모든 한국어 내용을 영어 필드로 복사하시겠습니까? (저장 전까지는 반영되지 않습니다)')) {
      setContent(prev => prev.map(item => ({ ...item, value_en: item.value_ko })));
      setModifiedIds(new Set(content.map(i => i.id)));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E67E5F]"></div>
    </div>
  );

  const activeSection = SECTIONS.find(s => s.id === activeTab);

  return (
    <div className="min-h-screen bg-white font-pretendard pb-32">
      {/* Header Bar */}
      <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900">콘텐츠 편집</h1>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-50 p-1 rounded-xl">
            <button 
              onClick={() => setLang('ko')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${lang === 'ko' ? 'bg-[#E67E5F] text-white shadow-sm' : 'text-gray-400'}`}
            >
              <span className="w-2 h-2 rounded-full bg-red-400" /> 한국어
            </button>
            <button 
              onClick={() => setLang('en')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${lang === 'en' ? 'bg-[#E67E5F] text-white shadow-sm' : 'text-gray-400'}`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-400" /> English
            </button>
          </div>
          <button 
            onClick={copyToEnglish}
            className="px-6 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all flex items-center gap-2 border border-gray-100"
          >
            <ChevronRight size={16} /> 영어(EN) 복사
          </button>
          <button 
            onClick={handleBatchUpdate}
            disabled={modifiedIds.size === 0 || saving}
            className="px-8 py-2.5 bg-[#8C8C8C] text-white rounded-xl text-sm font-bold hover:bg-gray-600 transition-all disabled:opacity-50"
          >
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-10">
        {/* Breadcrumb Info */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">콘텐츠 편집</h2>
          <p className="text-gray-400 font-medium">웹사이트에 표시되는 모든 텍스트를 수정합니다.</p>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap bg-gray-50 p-1.5 rounded-2xl gap-1 mb-12">
          {SECTIONS.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === section.id 
                  ? 'bg-[#E67E5F] text-white shadow-sm' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100/50'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Section Header */}
        <div className="mb-12 border-l-4 border-[#E67E5F] pl-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{activeSection?.label} 섹션</h3>
          <p className="text-gray-400 font-medium">{activeSection?.description || '이 섹션의 콘텐츠를 관리합니다.'}</p>
        </div>

        {/* Fields Grid */}
        <div className="space-y-12">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-8">
              {filteredItems.map(item => (
                <div key={item.id} className="group">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      {KEY_LABELS[item.key] || item.key}
                    </label>
                    <div className="flex bg-gray-50 p-1 rounded-lg">
                      {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                        <button 
                          key={size}
                          className={`w-8 h-8 rounded-md text-[10px] font-bold transition-all ${size === 'S' ? 'bg-[#E67E5F] text-white shadow-sm' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    {item.key.includes('desc') || item.key.includes('description') || item.key.includes('message') ? (
                      <textarea
                        value={(lang === 'ko' ? item.value_ko : item.value_en) || ''}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                        placeholder={`${lang === 'ko' ? '내용을 입력하세요' : 'Enter content'}...`}
                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#E67E5F]/20 focus:border-[#E67E5F] outline-none transition-all min-h-[120px] resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={(lang === 'ko' ? item.value_ko : item.value_en) || ''}
                        onChange={(e) => handleChange(item.id, e.target.value)}
                        placeholder={`${lang === 'ko' ? '내용을 입력하세요' : 'Enter content'}...`}
                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium focus:ring-2 focus:ring-[#E67E5F]/20 focus:border-[#E67E5F] outline-none transition-all"
                      />
                    )}
                  </div>
                </div>
              ))}
              
              {/* Specialized Button Group (if in Hero) */}
              {activeTab === 'hero' && (
                <div className="pt-8 border-t border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900 mb-6">버튼</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-700 px-1">버튼 1 텍스트</label>
                      <input 
                        type="text" 
                        placeholder="사역 알아보기"
                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium outline-none"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-bold text-gray-700 px-1">버튼 1 링크</label>
                      <input 
                        type="text" 
                        placeholder="#ministry"
                        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl text-gray-700 font-medium outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-32 text-center bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">이 섹션에 등록된 콘텐츠가 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      {modifiedIds.size > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-[2rem] px-10 py-5 flex items-center gap-12 z-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={revertAll}
            className="text-gray-500 font-bold hover:text-gray-900 transition-colors"
          >
            되돌리기
          </button>
          <button 
            onClick={handleBatchUpdate}
            disabled={saving}
            className="px-12 py-3.5 bg-gray-500 text-white rounded-2xl font-bold hover:bg-gray-600 transition-all shadow-lg shadow-gray-200"
          >
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Content;
