import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { CheckCircle, Clock, Trash2 } from 'lucide-react';

interface Letter {
  id: string;
  name: string;
  email: string;
  location: string;
  reason: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  created_at: string;
}

const Letters = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching letters:', error);
    } else {
      setLetters(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected' | 'archived') => {
    const { error } = await supabase
      .from('letters')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchLetters();
    }
  };

  const deleteLetter = async (id: string) => {
    if (!confirm('Are you sure you want to delete this letter?')) return;

    const { error } = await supabase
      .from('letters')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting letter:', error);
    } else {
      fetchLetters();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Letters of Hope</h2>
        <button 
          onClick={fetchLetters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading letters...</div>
      ) : (
        <div className="grid gap-6">
          {letters.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center text-gray-500">
              No letters found.
            </div>
          ) : (
            letters.map((letter) => (
              <div 
                key={letter.id} 
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{letter.name}</h3>
                    <p className="text-sm text-gray-500">{letter.email} | {letter.location}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(letter.created_at).toLocaleString()}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      Reason: {letter.reason}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {letter.status === 'pending' ? (
                      <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        <Clock className="w-3 h-3 mr-1" />
                        Pending
                      </span>
                    ) : (
                      <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded mb-4 whitespace-pre-wrap">
                  {letter.message}
                </div>
                <div className="flex justify-end space-x-3">
                  {letter.status === 'pending' && (
                    <button
                      onClick={() => updateStatus(letter.id, 'approved')}
                      className="text-sm text-green-600 hover:text-green-700 font-medium"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteLetter(letter.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Letters;
