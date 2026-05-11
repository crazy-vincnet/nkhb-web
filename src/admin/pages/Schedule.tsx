import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2 } from 'lucide-react';

interface ScheduleItem {
  id: string;
  day: string;
  time: string;
  frequency: string;
  is_active: boolean;
}

const Schedule = () => {
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDay, setNewDay] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newFreq, setNewFreq] = useState('');

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
    const { error } = await supabase
      .from('schedule')
      .insert([{ day: newDay, time: newTime, frequency: newFreq, is_active: true }]);

    if (error) {
      console.error('Error adding item:', error);
      alert('Error adding item: ' + error.message);
    } else {
      setNewDay('');
      setNewTime('');
      setNewFreq('');
      fetchSchedule();
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('schedule')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating schedule:', error);
    } else {
      fetchSchedule();
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    const { error } = await supabase
      .from('schedule')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
    } else {
      fetchSchedule();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Broadcast Schedule</h2>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Add New Schedule Entry</h3>
        <form onSubmit={addItem} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Day(s)</label>
            <input
              type="text"
              required
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., Mon · Wed · Fri"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time (KST)</label>
            <input
              type="text"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., 02:30-03:00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <input
              type="text"
              required
              value={newFreq}
              onChange={(e) => setNewFreq(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g., 5920 kHz"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Entry
            </button>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading schedule...</div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day(s)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (KST)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {schedule.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.day}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{item.frequency}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleActive(item.id, item.is_active)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        item.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-900"
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
    </div>
  );
};

export default Schedule;
