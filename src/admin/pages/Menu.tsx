import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  Link as LinkIcon, 
  Globe,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MenuItem {
  id: string;
  label_ko: string;
  label_en: string;
  path: string;
  order: number;
  is_active: boolean;
}

const MenuAdmin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching menu:', error);
    } else {
      setMenuItems(data || []);
    }
    setLoading(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addItem = () => {
    const newItem: MenuItem = {
      id: `temp-${Date.now()}`,
      label_ko: '새 메뉴',
      label_en: 'New Menu',
      path: '/',
      order: menuItems.length + 1,
      is_active: true,
    };
    setMenuItems([...menuItems, newItem]);
  };

  const removeItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(menuItems.map((item) => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const saveMenu = async () => {
    setSaving(true);
    try {
      // 1. Get current IDs from DB to handle deletions
      const { data: existingData } = await supabase.from('menu_items').select('id');
      const existingIds = existingData?.map(d => d.id) || [];
      const currentIds = menuItems.filter(item => !item.id.startsWith('temp-')).map(item => item.id);
      const idsToDelete = existingIds.filter(id => !currentIds.includes(id));

      // 2. Delete removed items
      if (idsToDelete.length > 0) {
        await supabase.from('menu_items').delete().in('id', idsToDelete);
      }

      // 3. Upsert current items with updated order
      const dataToUpsert = menuItems.map((item, index) => {
        const { id, ...rest } = item;
        const payload: any = {
          ...rest,
          order: index + 1
        };
        // Only include id if it's not a temp one
        if (!id.startsWith('temp-')) {
          payload.id = id;
        }
        return payload;
      });

      const { error } = await supabase.from('menu_items').upsert(dataToUpsert);
      if (error) throw error;

      alert('메뉴가 성공적으로 저장되었습니다.');
      fetchMenu(); // Refresh to get real IDs
    } catch (error: any) {
      alert('저장 실패: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold">네비게이션 메뉴 관리</h2>
          <p className="text-sm text-gray-500 mt-1">드래그하여 순서를 변경하고 메뉴 항목을 수정하세요.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={addItem}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> 항목 추가
          </button>
          <button
            onClick={saveMenu}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-blue-200 dark:shadow-none disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> {saving ? '저장 중...' : '메뉴 저장'}
          </button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={menuItems.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {menuItems.map((item) => (
              <SortableItem 
                key={item.id} 
                item={item} 
                onRemove={removeItem}
                onUpdate={updateItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {menuItems.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-400">메뉴 항목이 없습니다. '항목 추가'를 눌러 시작하세요.</p>
        </div>
      )}
    </div>
  );
};

interface SortableItemProps {
  item: MenuItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof MenuItem, value: any) => void;
}

const SortableItem = ({ item, onRemove, onUpdate }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-gray-800 p-4 rounded-2xl border ${
        isDragging ? 'border-blue-500 shadow-xl opacity-90' : 'border-gray-200 dark:border-gray-700 shadow-sm'
      } flex flex-col sm:flex-row items-start sm:items-center gap-4 group transition-shadow`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing text-gray-400"
      >
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* KO Label */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">
            <Globe className="w-3 h-3" /> 한국어 라벨
          </div>
          <input
            type="text"
            value={item.label_ko}
            onChange={(e) => onUpdate(item.id, 'label_ko', e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* EN Label */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
            <Globe className="w-3 h-3" /> English Label
          </div>
          <input
            type="text"
            value={item.label_en}
            onChange={(e) => onUpdate(item.id, 'label_en', e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Path */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <LinkIcon className="w-3 h-3" /> 이동 경로 (URL/Hash)
          </div>
          <input
            type="text"
            value={item.path}
            onChange={(e) => onUpdate(item.id, 'path', e.target.value)}
            className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm font-mono outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="/#section or /page"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center pt-2 sm:pt-0">
        <button
          onClick={() => onUpdate(item.id, 'is_active', !item.is_active)}
          className={`p-2 rounded-lg transition-colors ${
            item.is_active 
              ? 'text-green-600 bg-green-50 dark:bg-green-900/20 hover:bg-green-100' 
              : 'text-gray-400 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100'
          }`}
          title={item.is_active ? '활성 상태' : '비활성 상태'}
        >
          {item.is_active ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          title="삭제"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default MenuAdmin;
