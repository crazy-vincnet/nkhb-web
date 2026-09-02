import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { isoToKstInput, kstInputToIso, formatKstLabel } from '../lib/kstDatetime';
import { Plus, Trash2, Pencil, Check, X, Loader2 } from 'lucide-react';

interface ScheduleItem {
  id: string;
  day?: string;
  day_ko: string;
  day_en: string;
  time: string;
  frequency: string;
  is_active: boolean;
  visible_from?: string | null;
  visible_until?: string | null;
}

type EditForm = {
  day_ko: string;
  day_en: string;
  time: string;
  frequency: string;
  visible_from: string;
  visible_until: string;
};

const EMPTY_EDIT_FORM: EditForm = {
  day_ko: '',
  day_en: '',
  time: '',
  frequency: '',
  visible_from: '',
  visible_until: '',
};

// Mirrors the public site's filter so admins can see what is live right now.
const isWithinWindow = (item: Pick<ScheduleItem, 'visible_from' | 'visible_until'>) => {
  const now = Date.now();
  if (item.visible_from && now < new Date(item.visible_from).getTime()) return false;
  if (item.visible_until && now > new Date(item.visible_until).getTime()) return false;
  return true;
};

// Both bounds are optional, but a reversed window would silently hide the card.
const isWindowInvalid = (from: string, until: string) =>
  Boolean(from && until && from >= until);

const Schedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDayKo, setNewDayKo] = useState('');
  const [newDayEn, setNewDayEn] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newFreq, setNewFreq] = useState('');
  const [newVisibleFrom, setNewVisibleFrom] = useState('');
  const [newVisibleUntil, setNewVisibleUntil] = useState('');
  const [adding, setAdding] = useState(false);
  const [boxCount, setBoxCount] = useState<1 | 2>(1);
  const [boxCountEffectiveFrom, setBoxCountEffectiveFrom] = useState('2026-08-31');
  const [savingDisplay, setSavingDisplay] = useState(false);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>(EMPTY_EDIT_FORM);
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    const [{ data, error }, { data: settingData }] = await Promise.all([
      supabase
        .from('schedule')
        .select('*')
        .order('created_at', { ascending: true }),
      supabase
        .from('sites_settings')
        .select('key, value_ko')
        .in('key', ['schedule_box_count', 'schedule_box_count_effective_from']),
    ]);

    if (error) {
      console.error('Error fetching schedule:', error);
    } else {
      setSchedule(data || []);
    }
    const settings = new Map((settingData || []).map(setting => [setting.key, setting.value_ko || '']));
    const savedCount = Number(settings.get('schedule_box_count') || 1);
    setBoxCount(savedCount === 2 ? 2 : 1);
    setBoxCountEffectiveFrom(settings.get('schedule_box_count_effective_from') || '2026-08-31');
    setLoading(false);
  };

  const saveDisplaySettings = async () => {
    setSavingDisplay(true);
    const updatedAt = new Date().toISOString();
    const { error } = await supabase
      .from('sites_settings')
      .upsert([
        { key: 'schedule_box_count', value_ko: String(boxCount), value_en: String(boxCount), updated_at: updatedAt },
        { key: 'schedule_box_count_effective_from', value_ko: boxCountEffectiveFrom, value_en: boxCountEffectiveFrom, updated_at: updatedAt },
      ], { onConflict: 'key' });

    if (error) {
      console.error('Error saving schedule display settings:', error);
      alert('노출 설정 저장 실패: ' + error.message);
    } else {
      alert('공개 사이트 노출 설정을 저장했습니다.');
    }
    setSavingDisplay(false);
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDayKo.trim() && !newDayEn.trim()) {
      alert('요일(한국어 또는 영어)을 입력하세요.');
      return;
    }
    if (isWindowInvalid(newVisibleFrom, newVisibleUntil)) {
      alert('노출 종료 시간은 시작 시간보다 뒤여야 합니다.');
      return;
    }
    setAdding(true);
    const { error } = await supabase
      .from('schedule')
      .insert([{
        day_ko: newDayKo.trim(),
        day_en: newDayEn.trim(),
        time: newTime.trim(),
        frequency: newFreq.trim(),
        visible_from: kstInputToIso(newVisibleFrom),
        visible_until: kstInputToIso(newVisibleUntil),
        is_active: true,
      }]);

    if (error) {
      console.error('Error adding item:', error);
      alert('추가 실패: ' + error.message);
    } else {
      setNewDayKo('');
      setNewDayEn('');
      setNewTime('');
      setNewFreq('');
      setNewVisibleFrom('');
      setNewVisibleUntil('');
      await fetchSchedule();
    }
    setAdding(false);
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setEditForm({
      day_ko: item.day_ko || item.day || '',
      day_en: item.day_en || item.day || '',
      time: item.time,
      frequency: item.frequency || '',
      visible_from: isoToKstInput(item.visible_from),
      visible_until: isoToKstInput(item.visible_until),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(EMPTY_EDIT_FORM);
  };

  const saveEdit = async (id: string) => {
    if ((!editForm.day_ko.trim() && !editForm.day_en.trim()) || !editForm.time.trim()) {
      alert('요일(한국어 또는 영어)과 시간은 필수입니다.');
      return;
    }
    if (isWindowInvalid(editForm.visible_from, editForm.visible_until)) {
      alert('노출 종료 시간은 시작 시간보다 뒤여야 합니다.');
      return;
    }
    setSavingEdit(true);
    const { error } = await supabase
      .from('schedule')
      .update({
        day_ko: editForm.day_ko.trim(),
        day_en: editForm.day_en.trim(),
        time: editForm.time.trim(),
        frequency: editForm.frequency.trim(),
        visible_from: kstInputToIso(editForm.visible_from),
        visible_until: kstInputToIso(editForm.visible_until),
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating schedule:', error);
      // UNIQUE(day, time) collisions surface here.
      alert('수정 실패: ' + error.message);
    } else {
      cancelEdit();
      await fetchSchedule();
    }
    setSavingEdit(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('schedule')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating schedule:', error);
    } else {
      setSchedule(prev => prev.map(s => (s.id === id ? { ...s, is_active: !currentStatus } : s)));
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('이 항목을 삭제하시겠습니까?')) return;
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      alert('삭제 실패: ' + error.message);
    } else {
      setSchedule(prev => prev.filter(s => s.id !== id));
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-pretendard pb-20">
      <div>
        <h2 className="text-2xl font-bold">방송 편성표 (Broadcast Schedule)</h2>
        <p className="text-sm text-gray-500 mt-1">방송 요일·시간·주파수를 추가하고 수정하세요. 공개 사이트에는 활성 항목만 표시됩니다.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h3 className="text-lg font-semibold">공개 사이트 박스 노출 설정</h3>
            <p className="text-sm text-gray-500 mt-1">
              지정한 날짜부터 활성 편성 중 위에서부터 선택한 개수만 노출됩니다. 적용일을 비우면 저장 즉시 반영됩니다.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[160px_190px_auto] gap-3 w-full lg:w-auto">
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">노출 박스 수</label>
              <select
                value={boxCount}
                onChange={(e) => setBoxCount(Number(e.target.value) === 2 ? 2 : 1)}
                className={inputClass}
              >
                <option value={1}>1개</option>
                <option value={2}>2개</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">적용 시작일 (한국시간)</label>
              <input
                type="date"
                value={boxCountEffectiveFrom}
                onChange={(e) => setBoxCountEffectiveFrom(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={saveDisplaySettings}
                disabled={savingDisplay}
                className="w-full bg-gray-900 text-white px-5 py-2 rounded-lg hover:bg-black transition-colors flex items-center justify-center font-bold disabled:opacity-50"
              >
                {savingDisplay ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                설정 저장
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add new entry */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">새 편성 추가</h3>
        <p className="text-sm text-gray-500 -mt-3 mb-4">
          노출 시작/종료 시간을 비우면 해당 방향으로 제한 없이 계속 노출됩니다. 모든 시간은 한국시간(KST) 기준입니다.
        </p>
        <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">요일 (한국어)</label>
            <input
              type="text"
              value={newDayKo}
              onChange={(e) => setNewDayKo(e.target.value)}
              className={inputClass}
              placeholder="예: 월 · 수 · 금"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">요일 (English)</label>
            <input
              type="text"
              value={newDayEn}
              onChange={(e) => setNewDayEn(e.target.value)}
              className={inputClass}
              placeholder="e.g., Mon · Wed · Fri"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">시간 (KST)</label>
            <input
              type="text"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className={inputClass}
              placeholder="예: 02:30-03:00"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">주파수 (Frequency)</label>
            <input
              type="text"
              value={newFreq}
              onChange={(e) => setNewFreq(e.target.value)}
              className={inputClass}
              placeholder="예: 5920 kHz"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">노출 시작 (KST, 선택)</label>
            <input
              type="datetime-local"
              value={newVisibleFrom}
              onChange={(e) => setNewVisibleFrom(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">노출 종료 (KST, 선택)</label>
            <input
              type="datetime-local"
              value={newVisibleUntil}
              onChange={(e) => setNewVisibleUntil(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={adding}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center font-bold disabled:opacity-50"
            >
              {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              추가
            </button>
          </div>
        </form>
      </div>

      {/* Schedule list */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      ) : schedule.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          등록된 편성이 없습니다. 위에서 새 편성을 추가하세요.
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">요일 (KO)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">요일 (EN)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">시간 (KST)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">주파수</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">노출 기간 (KST)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">작업</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {schedule.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr key={item.id} className={isEditing ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}>
                    {isEditing ? (
                      <>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={editForm.day_ko}
                            onChange={(e) => setEditForm(f => ({ ...f, day_ko: e.target.value }))}
                            className={inputClass}
                            placeholder="월 · 수 · 금"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={editForm.day_en}
                            onChange={(e) => setEditForm(f => ({ ...f, day_en: e.target.value }))}
                            className={inputClass}
                            placeholder="Mon · Wed · Fri"
                          />
                        </td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={editForm.time}
                            onChange={(e) => setEditForm(f => ({ ...f, time: e.target.value }))}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-6 py-3">
                          <input
                            type="text"
                            value={editForm.frequency}
                            onChange={(e) => setEditForm(f => ({ ...f, frequency: e.target.value }))}
                            className={inputClass}
                          />
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex flex-col gap-2 min-w-[210px]">
                            <input
                              type="datetime-local"
                              value={editForm.visible_from}
                              onChange={(e) => setEditForm(f => ({ ...f, visible_from: e.target.value }))}
                              className={inputClass}
                              aria-label="노출 시작 (KST)"
                            />
                            <input
                              type="datetime-local"
                              value={editForm.visible_until}
                              onChange={(e) => setEditForm(f => ({ ...f, visible_until: e.target.value }))}
                              className={inputClass}
                              aria-label="노출 종료 (KST)"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-400">
                          {item.is_active ? '활성' : '비활성'}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => saveEdit(item.id)}
                              disabled={savingEdit}
                              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                              title="저장"
                            >
                              {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={cancelEdit}
                              disabled={savingEdit}
                              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                              title="취소"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.day_ko || item.day || <span className="text-gray-300">—</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.day_en || <span className="text-gray-300">—</span>}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.frequency}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.visible_from || item.visible_until ? (
                            <div className="flex flex-col leading-tight">
                              <span>{formatKstLabel(item.visible_from) || '제한 없음'}</span>
                              <span className="text-gray-400">~ {formatKstLabel(item.visible_until) || '제한 없음'}</span>
                              {!isWithinWindow(item) && (
                                <span className="mt-1 text-xs font-bold text-amber-600">기간 외 (현재 미노출)</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-300">상시 노출</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => toggleActive(item.id, item.is_active)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-full transition-colors ${
                              item.is_active
                                ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {item.is_active ? '활성' : '비활성'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                              title="수정"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 transition-colors"
                              title="삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Schedule;
