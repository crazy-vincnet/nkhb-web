import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Pencil, Check, X, Loader2 } from 'lucide-react';

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  frequency: string;
  is_active: boolean;
}

type EditForm = { day: string; time: string; frequency: string };

const Schedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newFreq, setNewFreq] = useState('');
  const [adding, setAdding] = useState(false);

  // Inline editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({ day: '', time: '', frequency: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('schedule')
      .select('*')
      .order('day', { ascending: true });

    if (error) {
      console.error('Error fetching schedule:', error);
    } else {
      setSchedule(data || []);
    }
    setLoading(false);
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const { error } = await supabase
      .from('schedule')
      .insert([{ day: newDay.trim(), time: newTime.trim(), frequency: newFreq.trim(), is_active: true }]);

    if (error) {
      console.error('Error adding item:', error);
      alert('추가 실패: ' + error.message);
    } else {
      setNewDay('');
      setNewTime('');
      setNewFreq('');
      await fetchSchedule();
    }
    setAdding(false);
  };

  const startEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setEditForm({ day: item.day, time: item.time, frequency: item.frequency || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ day: '', time: '', frequency: '' });
  };

  const saveEdit = async (id: string) => {
    if (!editForm.day.trim() || !editForm.time.trim()) {
      alert('요일과 시간은 필수입니다.');
      return;
    }
    setSavingEdit(true);
    const { error } = await supabase
      .from('schedule')
      .update({
        day: editForm.day.trim(),
        time: editForm.time.trim(),
        frequency: editForm.frequency.trim(),
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

      {/* Add new entry */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">새 편성 추가</h3>
        <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">요일 (Day)</label>
            <input
              type="text"
              required
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className={inputClass}
              placeholder="예: 월 · 수 · 금"
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
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">요일</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">시간 (KST)</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">주파수</th>
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
                            value={editForm.day}
                            onChange={(e) => setEditForm(f => ({ ...f, day: e.target.value }))}
                            className={inputClass}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.day}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{item.frequency}</td>
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
