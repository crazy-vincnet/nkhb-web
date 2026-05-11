import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save, Upload, Image as ImageIcon } from 'lucide-react';

interface ContentItem {
  id: string;
  key: string;
  value_ko: string;
  value_en: string;
}

const Content = () => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
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
      const filePath = `logos/${fileName}`;

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
    return key.toLowerCase().includes('logo') || key.toLowerCase().includes('image') || key.toLowerCase().includes('url');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Website Content</h2>

      {loading ? (
        <div className="text-center py-10">Loading content...</div>
      ) : (
        <div className="space-y-6">
          {content.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">{item.key}</h3>
                </div>
                <button
                  onClick={() => handleUpdate(item)}
                  disabled={saving === item.id}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving === item.id ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* KO Section */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Korean (KO)</label>
                  {isImageUrlKey(item.key) ? (
                    <div className="space-y-2">
                      {item.value_ko && (
                        <div className="mb-2 p-2 border rounded bg-gray-50 dark:bg-gray-900 flex justify-center">
                          <img src={item.value_ko} alt="Preview KO" className="max-h-32 object-contain" />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.value_ko}
                          onChange={(e) => handleChange(item.id, 'value_ko', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center shrink-0">
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
                        <p className="text-xs text-blue-500 italic">Uploading...</p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      value={item.value_ko}
                      onChange={(e) => handleChange(item.id, 'value_ko', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>

                {/* EN Section */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">English (EN)</label>
                  {isImageUrlKey(item.key) ? (
                    <div className="space-y-2">
                      {item.value_en && (
                        <div className="mb-2 p-2 border rounded bg-gray-50 dark:bg-gray-900 flex justify-center">
                          <img src={item.value_en} alt="Preview EN" className="max-h-32 object-contain" />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={item.value_en}
                          onChange={(e) => handleChange(item.id, 'value_en', e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 text-sm"
                          placeholder="Image URL"
                        />
                        <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors flex items-center shrink-0">
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
                        <p className="text-xs text-blue-500 italic">Uploading...</p>
                      )}
                    </div>
                  ) : (
                    <textarea
                      value={item.value_en}
                      onChange={(e) => handleChange(item.id, 'value_en', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Content;
