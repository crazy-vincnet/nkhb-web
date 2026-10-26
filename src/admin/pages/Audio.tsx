import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { fitAudioForUpload, MAX_UPLOAD_BYTES } from '../lib/audioCompressor';
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
  Radio
} from 'lucide-react';

interface AudioTrack {
  id: string;
  title_ko: string;
  title_en: string;
  url: string;
  is_active: boolean;
  publish_at: string;
  created_at: string;
}

// ISO timestamp -> value for <input type="datetime-local"> in the admin's local time.
const toLocalInput = (iso: string) => {
  const d = new Date(iso);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const Audio = () => {
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [compressProgress, setCompressProgress] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [titleKo, setTitleKo] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [publishNow, setPublishNow] = useState(true);
  const [publishAt, setPublishAt] = useState('');

  // Current shortwave frequency shown on the public radio (kHz).
  const [freqKhz, setFreqKhz] = useState('');
  const [freqSaved, setFreqSaved] = useState(false);

  // Audio Player State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioInstance = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchTracks();
    supabase.from('sites_settings').select('value_ko').eq('key', 'radio_freq_khz').maybeSingle()
      .then(({ data }) => setFreqKhz(data?.value_ko || ''));
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
      .order('publish_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracks:', error);
    } else {
      setTracks(data || []);
    }
    setLoading(false);
  };

  const saveFreq = async () => {
    const khz = Number(freqKhz);
    if (!Number.isFinite(khz) || khz < 1000 || khz > 30000) {
      alert('주파수를 kHz 단위로 입력해 주세요. (예: 9445)');
      return;
    }
    const { error } = await supabase.from('sites_settings').upsert(
      [{ key: 'radio_freq_khz', value_ko: String(khz), value_en: String(khz), updated_at: new Date().toISOString() }],
      { onConflict: 'key' }
    );
    if (error) {
      alert(error.message);
      return;
    }
    setFreqSaved(true);
    setTimeout(() => setFreqSaved(false), 2000);
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitleKo('');
    setTitleEn('');
    setSelectedFile(null);
    setPublishNow(true);
    setPublishAt(toLocalInput(new Date().toISOString()));
    setShowModal(true);
  };

  const openEditModal = (track: AudioTrack) => {
    setEditingId(track.id);
    setTitleKo(track.title_ko);
    setTitleEn(track.title_en);
    setSelectedFile(null);
    // Editing keeps the existing publish time unless the admin changes it.
    setPublishNow(false);
    setPublishAt(toLocalInput(track.publish_at));
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let finalUrl = tracks.find(t => t.id === editingId)?.url || '';

      if (selectedFile) {
        const file = await fitAudioForUpload(selectedFile, setCompressProgress);
        setCompressProgress(null);
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `broadcasts/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('audio')
          .upload(filePath, file, { contentType: file.type });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('audio')
          .getPublicUrl(filePath);
        
        finalUrl = publicUrl;
      }

      if (!finalUrl && !selectedFile) throw new Error('오디오 파일을 선택해주세요.');

      // datetime-local is read in the admin's local time zone (KST in practice).
      const publish_at = publishNow ? new Date().toISOString() : new Date(publishAt).toISOString();

      if (editingId) {
        const { error: dbError } = await supabase
          .from('audio_tracks')
          .update({
            title_ko: titleKo,
            title_en: titleEn,
            url: finalUrl,
            publish_at
          })
          .eq('id', editingId);
        if (dbError) throw dbError;
      } else {
        const { error: dbError } = await supabase
          .from('audio_tracks')
          .insert([{
            title_ko: titleKo,
            title_en: titleEn,
            url: finalUrl,
            is_active: true,
            publish_at
          }]);
        if (dbError) throw dbError;
      }

      setShowModal(false);
      fetchTracks();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
      setCompressProgress(null);
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
      audio.play().catch(() => setPlayingId(null));
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

  // Tracks are sorted by publish_at desc, so the first published active one is on air.
  const now = Date.now();
  const onAirId = tracks.find(t => t.is_active && new Date(t.publish_at).getTime() <= now)?.id;

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
          <p className="text-gray-500 font-medium mt-1">공개 시각이 지난 가장 최근 방송 1건이 메인과 방송듣기 페이지에 「오늘의 방송」으로 노출됩니다.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          신규 트랙 업로드
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Radio className="w-6 h-6 text-blue-600 shrink-0" />
          <div>
            <h3 className="font-black text-gray-900 dark:text-white">현재 송출 주파수</h3>
            <p className="text-sm text-gray-500 font-medium">라디오 이미지의 빨간 바늘과 우상단 MHz 숫자가 이 값으로 표시됩니다.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1000}
            max={30000}
            value={freqKhz}
            onChange={(e) => setFreqKhz(e.target.value)}
            className="w-32 px-4 py-3 bg-gray-50 dark:bg-gray-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 font-bold text-right"
            placeholder="9445"
            aria-label="주파수 (kHz)"
          />
          <span className="font-bold text-gray-500">kHz</span>
          <button
            onClick={saveFreq}
            className="ml-2 bg-gray-900 text-white px-5 py-3 rounded-xl font-black hover:bg-black transition-all flex items-center gap-2"
          >
            {freqSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {freqSaved ? '저장됨' : '저장'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tracks.map((track) => {
          const scheduled = new Date(track.publish_at).getTime() > now;
          return (
          <div
            key={track.id}
            className={`bg-white dark:bg-gray-900 p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row items-center gap-6 ${
              track.is_active ? 'border-gray-100 dark:border-gray-800 shadow-sm' : 'border-gray-100 opacity-60 grayscale bg-gray-50'
            } ${track.id === onAirId ? 'ring-2 ring-red-400' : ''}`}
          >
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
                {track.id === onAirId && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700">On Air · 오늘의 방송</span>
                )}
                {scheduled && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-700">예약됨</span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${track.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                  {track.is_active ? 'Active' : 'Inactive'}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase tracking-widest" title="공개 시각">
                  <Clock className="w-3 h-3" /> {new Date(track.publish_at).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}
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
          );
        })}
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
                        <span className="text-[10px] font-bold text-gray-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                          {selectedFile.size > MAX_UPLOAD_BYTES && ' · 50MB 초과 — 업로드 시 자동으로 용량을 줄입니다'}
                        </span>
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

                <div className="space-y-2">
                  <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                    <Clock className="w-3 h-3" /> 공개 시각
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[true, false].map(immediate => (
                      <button
                        key={String(immediate)}
                        type="button"
                        onClick={() => setPublishNow(immediate)}
                        className={`py-3 rounded-2xl font-black text-sm transition-all ${publishNow === immediate ? 'bg-blue-600 text-white' : 'bg-gray-50 dark:bg-gray-800 text-gray-500'}`}
                      >
                        {immediate ? '즉시 공개' : '공개 시각 지정 (예약)'}
                      </button>
                    ))}
                  </div>
                  {!publishNow && (
                    <input
                      type="datetime-local"
                      required
                      value={publishAt}
                      onChange={(e) => setPublishAt(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                    />
                  )}
                  <p className="text-[11px] text-gray-400 font-medium px-1">지정한 시각이 되면 메인의 「오늘의 방송」이 자동으로 이 파일로 바뀝니다.</p>
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
                      {compressProgress !== null ? `용량 줄이는 중... ${Math.round(compressProgress * 100)}%` : '처리 중...'}
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
