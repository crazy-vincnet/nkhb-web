import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Upload, Search, Filter } from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<{id: string, field: string} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'text' | 'image'>('all');

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    let result = content;

    // Search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.value_ko?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.value_en?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type filter
    if (filterType === 'image') {
      result = result.filter(item => isImageUrlKey(item.key));
    } else if (filterType === 'text') {
      result = result.filter(item => !isImageUrlKey(item.key));
    }

    setFilteredContent(result);
  }, [searchQuery, filterType, content]);

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
      alert('Failed to save changes');
    } else {
      alert('Changes saved successfully');
    }
    setSaving(null);
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
      const folder = isImageUrlKey(id) ? 'site-assets' : 'uploads';
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      handleChange(id, field, publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      alert('Error uploading image: ' + error.message + '\nMake sure "assets" bucket exists and is public.');
    } finally {
      setUploading(null);
    }
  };

  const isImageUrlKey = (key: string) => {
    const k = key.toLowerCase();
    return k.includes('logo') || k.includes('image') || k.includes('url') || k.startsWith('image_');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold">Website Content Management</h2>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search keys or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 w-full"
            />
          </div>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          >
            <option value="all">All Types</option>
            <option value="text">Text Only</option>
            <option value="image">Images Only</option>
          </select>

          <button 
            onClick={fetchContent}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-500">Loading website content...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredContent.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <p className="text-gray-500">No content items found matching your filters.</p>
            </div>
          ) : (
            filteredContent.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b dark:border-gray-700 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isImageUrlKey(item.key) ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {isImageUrlKey(item.key) ? <Upload className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-none mb-1">{item.key}</h3>
                      <p className="text-xs text-gray-500 font-mono">{isImageUrlKey(item.key) ? 'IMAGE ASSET' : 'TEXT CONTENT'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUpdate(item)}
                    disabled={saving === item.id}
                    className="w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50 font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving === item.id ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* KO Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="w-6 h-4 bg-red-100 text-red-700 text-[10px] flex items-center justify-center rounded font-bold">KO</span>
                        Korean Version
                      </label>
                    </div>
                    
                    {isImageUrlKey(item.key) ? (
                      <div className="space-y-4">
                        <div className="aspect-video w-full border-2 border-dashed rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative group">
                          {item.value_ko ? (
                            <>
                              <img src={item.value_ko} alt="Preview KO" className="max-h-full max-w-full object-contain" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-xs font-medium">Image Preview</p>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-400 text-sm">No image uploaded</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.value_ko || ''}
                            onChange={(e) => handleChange(item.id, 'value_ko', e.target.value)}
                            className="flex-1 px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://image-url.com"
                          />
                          <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center shrink-0 border dark:border-gray-600">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading?.id === item.id && uploading?.field === 'value_ko'}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(item.id, 'value_ko', file);
                              }}
                            />
                          </label>
                        </div>
                        {uploading?.id === item.id && uploading?.field === 'value_ko' && (
                          <div className="flex items-center gap-2 text-xs text-blue-500 animate-pulse">
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Uploading to cloud...
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={item.value_ko || ''}
                        onChange={(e) => handleChange(item.id, 'value_ko', e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y min-h-[120px]"
                        placeholder="Enter Korean content here..."
                      />
                    )}
                  </div>

                  {/* EN Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="w-6 h-4 bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center rounded font-bold">EN</span>
                        English Version
                      </label>
                    </div>

                    {isImageUrlKey(item.key) ? (
                      <div className="space-y-4">
                        <div className="aspect-video w-full border-2 border-dashed rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative group">
                          {item.value_en ? (
                            <>
                              <img src={item.value_en} alt="Preview EN" className="max-h-full max-w-full object-contain" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-xs font-medium">Image Preview</p>
                              </div>
                            </>
                          ) : (
                            <p className="text-gray-400 text-sm">No image uploaded</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={item.value_en || ''}
                            onChange={(e) => handleChange(item.id, 'value_en', e.target.value)}
                            className="flex-1 px-4 py-2.5 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://image-url.com"
                          />
                          <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center shrink-0 border dark:border-gray-600">
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={uploading?.id === item.id && uploading?.field === 'value_en'}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(item.id, 'value_en', file);
                              }}
                            />
                          </label>
                        </div>
                        {uploading?.id === item.id && uploading?.field === 'value_en' && (
                          <div className="flex items-center gap-2 text-xs text-blue-500 animate-pulse">
                            <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            Uploading to cloud...
                          </div>
                        )}
                      </div>
                    ) : (
                      <textarea
                        value={item.value_en || ''}
                        onChange={(e) => handleChange(item.id, 'value_en', e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y min-h-[120px]"
                        placeholder="Enter English content here..."
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Content;
