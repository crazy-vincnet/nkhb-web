import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trash2, Plus } from 'lucide-react';

interface AudioTrack {
  id: string;
  title_ko: string;
  title_en: string;
  url: string;
  is_active: boolean;
  created_at: string;
}

const Audio = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitleKo, setNewTitleKo] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracks:', error);
    } else {
      setTracks(data || []);
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !newTitleKo || !newTitleEn) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `broadcasts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('audio')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('audio_tracks')
        .insert([{ 
          title_ko: newTitleKo, 
          title_en: newTitleEn, 
          url: publicUrl, 
          is_active: true 
        }]);

      if (dbError) throw dbError;

      setShowUploadModal(false);
      setNewTitleKo('');
      setNewTitleEn('');
      setSelectedFile(null);
      fetchTracks();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('audio_tracks')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating track:', error);
    } else {
      fetchTracks();
    }
  };

  const deleteTrack = async (id: string, url: string) => {
    if (!confirm('Are you sure you want to delete this track?')) return;

    try {
      // Extract file path from URL
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      const { error: storageError } = await supabase.storage
        .from('audio')
        .remove([`broadcasts/${fileName}`]);

      if (storageError) console.error('Error deleting from storage:', storageError);

      const { error: dbError } = await supabase
        .from('audio_tracks')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      fetchTracks();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Audio Tracks</h2>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload New Track
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading tracks...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title (KO / EN)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {tracks.map((track) => (
                <tr key={track.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium">{track.title_ko}</div>
                      <div className="text-xs text-gray-500">{track.title_en}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(track.id, track.is_active)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        track.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {track.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(track.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => deleteTrack(track.id, track.url)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Upload New Audio Track</h3>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title (Korean)</label>
                <input
                  type="text"
                  required
                  value={newTitleKo}
                  onChange={(e) => setNewTitleKo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="예: 방송 2024-05-06"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title (English)</label>
                <input
                  type="text"
                  required
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                  placeholder="e.g., Broadcast 2024-05-06"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Audio File</label>
                <input
                  type="file"
                  required
                  accept="audio/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Audio;
