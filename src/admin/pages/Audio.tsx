import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Trash2, 
  Plus, 
  Play, 
  Pause, 
  Edit2, 
  Save, 
  X, 
  Music, 
  Upload, 
  CheckCircle2,
  AlertCircle,
  Clock,
  Globe,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface AudioTrack {
  id: string;
  title_ko: string;
  title_en: string;
  url: string;
  is_active: boolean;
  order: number;
  created_at: string;
}

const Audio = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleKo, setTitleKo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Audio Player State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioInstance = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchTracks();
    return () => {
      if (audioInstance.current) {
        audioInstance.current.pause();
        audioInstance.current = null;
      }
    };
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('audio_tracks')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching tracks:', error);
    } else {
      setTracks(data || []);
    }
    setLoading(false);
  };

  const moveTrack = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= tracks.length) return;

    const currentTrack = tracks[index];
    const targetTrack = tracks[newIndex];

    // 1. Create a copy of current state for optimistic UI
    const updatedTracks = [...tracks];
    
    // 2. Swap order values in local state
    const currentOrder = currentTrack.order;
    const targetOrder = targetTrack.order;

    updatedTracks[index] = { ...targetTrack, order: currentOrder };
    updatedTracks[newIndex] = { ...currentTrack, order: targetOrder };

    // 3. Sort local state to reflect new order visually
    updatedTracks.sort((a, b) => a.order - b.order);
    setTracks(updatedTracks);

    // 4. Persist to DB using UPSERT (Supabase handles multiple rows in one call)
    try {
        const { error } = await supabase.from('audio_tracks').upsert([
            { id: currentTrack.id, order: targetOrder },
            { id: targetTrack.id, order: currentOrder }
        ]);

        if (error) throw error;
    } catch (err) {
        console.error('Failed to update order in DB:', err);
        fetchTracks(); // Revert to server state on failure
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitleKo('');
    setTitleEn('');
    setSelectedFile(null);
    setShowModal(true);
  };

  const openEditModal = (track: AudioTrack) => {
    setEditingId(track.id);
    setTitleKo(track.title_ko);
    setTitleEn(track.title_en);
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalUrl = tracks.find(t => t.id === editingId)?.url || '';

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `broadcasts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('audio')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('audio')
          .getPublicUrl(filePath);
        
        finalUrl = publicUrl;
      }

      if (!finalUrl && !selectedFile) throw new Error('오디오 파일을 선택해주세요.');

      if (editingId) {
        const { error: dbError } = await supabase
          .from('audio_tracks')
          .update({ 
            title_ko: titleKo, 
            title_en: titleEn, 
            url: finalUrl 
          })
          .eq('id', editingId);
        if (dbError) throw dbError;
      } else {
        const maxOrder = tracks.length > 0 ? Math.max(...tracks.map(t => t.order || 0)) : 0;
        const { error: dbError } = await supabase
          .from('audio_tracks')
          .insert([{ 
            title_ko: titleKo, 
            title_en: titleEn, 
            url: finalUrl, 
            is_active: true,
            order: maxOrder + 1
          }]);
        if (dbError) throw dbError;
      }

      setShowModal(false);
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
      setTracks(prev => prev.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t));
    }
  };

  const deleteTrack = async (id: string, url: string) => {
    if (!confirm('정말 이 트랙을 삭제하시겠습니까? 관련 파일도 모두 삭제됩니다.')) return;

    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('audio').remove([`broadcasts/${fileName}`]);

      const { error: dbError } = await supabase.from('audio_tracks').delete().eq('id', id);
      if (dbError) throw dbError;

      setTracks(prev => prev.filter(t => t.id !== id));
      if (playingId === id) stopAudio();
    } catch (error: any) {
      alert(error.message);
    }
  };

  const togglePlay = (track: AudioTrack) => {
    if (playingId === track.id) {
      stopAudio();
    } else {
      if (audioInstance.current) {
        audioInstance.current.pause();
      }
      const audio = new window.Audio(track.url);
      audioInstance.current = audio;
      audio.play();
      audio.onended = () => setPlayingId(null);
      setPlayingId(track.id);
    }
  };

  const stopAudio = () => {
    if (audioInstance.current) {
      audioInstance.current.pause();
    }
    setPlayingId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-pretendard">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Music className="w-8 h-8 text-blue-600" />
            Audio Tracks
          </h2>
          <p className="text-gray-500 font-medium mt-1">방송 음원의 노출 순서 및 정보를 관리합니다.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          신규 트랙 업로드
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            className={`bg-white dark:bg-gray-900 p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row items-center gap-6 ${
              track.is_active ? 'border-gray-100 dark:border-gray-800 shadow-sm' : 'border-gray-100 opacity-60 grayscale bg-gray-50'
            }`}
          >
            {/* Reorder Buttons */}
            <div className="flex md:flex-col gap-2 shrink-0">
                <button 
                  onClick={() => moveTrack(index, 'up')}
                  disabled={index === 0}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl text-gray-400 disabled:opacity-20 transition-all shadow-sm active:scale-90"
                  title="위로 이동"
                >
                    <ChevronUp size={20} />
                </button>
                <button 
                  onClick={() => moveTrack(index, 'down')}
                  disabled={index === tracks.length - 1}
                  className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl text-gray-400 disabled:opacity-20 transition-all shadow-sm active:scale-90"
                  title="아래로 이동"
                >
                    <ChevronDown size={20} />
                </button>
            </div>

            <button 
              onClick={() => togglePlay(track)}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                playingId === track.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {playingId === track.id ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>

            <div className="flex-1 min-w-0 w-full text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${track.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {track.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" /> {new Date(track.created_at).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white truncate">{track.title_ko}</h3>
              <p className="text-gray-400 font-medium text-sm truncate uppercase tracking-tighter">{track.title_en}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => toggleActive(track.id, track.is_active)}
                className={`p-3 rounded-xl transition-all ${track.is_active ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50' : 'text-blue-600 hover:bg-blue-50'}`}
                title={track.is_active ? '비활성화' : '활성화'}
              >
                <CheckCircle2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => openEditModal(track)}
                className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="정보 수정"
              >
                <Edit2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => deleteTrack(track.id, track.url)}
                className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="삭제"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => !uploading && setShowModal(false)} />
          <div className="bg-white dark:bg-gray-900 rounded-[3rem] p-10 max-w-lg w-full relative shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white">
                  {editingId ? '트랙 정보 수정' : '신규 트랙 업로드'}
                </h3>
                <p className="text-sm text-gray-500 font-medium mt-1">파일 및 제목을 입력해 주세요.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" /> 한국어 제목
                    </label>
                    <input
                      type="text"
                      required
                      value={titleKo}
                      onChange={(e) => setTitleKo(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                      placeholder="예: 방송 2024-05-13"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> English Title
                    </label>
                    <input
                      type="text"
                      required
                      value={titleEn}
                      onChange={(e) => setTitleEn(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                      placeholder="e.g., Broadcast May 13, 2024"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Upload className="w-3 h-3" /> Audio File
                  </label>
                  <label className="block w-full border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 text-center cursor-pointer hover:border-blue-200 transition-all">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                        <span className="text-sm font-black text-gray-900 dark:text-white truncate max-w-xs">{selectedFile.name}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <Music className="w-10 h-10" />
                        <span className="text-sm font-bold">{editingId ? '파일을 교체하려면 클릭' : '클릭하여 오디오 파일 선택'}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">MP3, WAV, AAC</span>
                      </div>
                    )}
                  </label>
                  {editingId && !selectedFile && (
                    <div className="flex items-center gap-2 text-[10px] text-blue-600 font-bold px-1">
                      <AlertCircle className="w-3 h-3" /> 이미 업로드된 파일이 있습니다.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-3"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      {editingId ? '수정 사항 저장' : '트랙 업로드 시작'}
                    </>
                  )}
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
