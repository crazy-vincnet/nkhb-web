import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Save } from 'lucide-react';

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
    }
    setSaving(null);
  };

  const handleChange = (id: string, field: 'value_ko' | 'value_en', value: string) => {
    setContent(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
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
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Korean (KO)</label>
                  <textarea
                    value={item.value_ko}
                    onChange={(e) => handleChange(item.id, 'value_ko', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">English (EN)</label>
                  <textarea
                    value={item.value_en}
                    onChange={(e) => handleChange(item.id, 'value_en', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                  />
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
