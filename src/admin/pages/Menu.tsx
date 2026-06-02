import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Save, 
  Plus, 
  Trash2, 
  GripVertical, 
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  PlusCircle
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
  parent_id: string | null;
  children?: MenuItem[];
}

const MenuAdmin = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

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

  const toggleExpand = (id: string) => {
    const next = new Set(expandedParents);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedParents(next);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setMenuItems((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        
        const activeItem = items[oldIndex];
        const overItem = items[newIndex];
        
        if (activeItem.parent_id === overItem.parent_id) {
          return arrayMove(items, oldIndex, newIndex);
        }
        return items;
      });
    }
  };

  const addItem = (parentId: string | null = null) => {
    const newItem: MenuItem = {
      id: `temp-${Date.now()}`,
      label_ko: '새 메뉴',
      label_en: 'New Menu',
      path: '/',
      order: menuItems.filter(i => i.parent_id === parentId).length + 1,
      is_active: true,
      parent_id: parentId
    };
    setMenuItems([...menuItems, newItem]);
    if (parentId) {
      const next = new Set(expandedParents);
      next.add(parentId);
      setExpandedParents(next);
    }
  };

  const removeItem = (id: string) => {
    setMenuItems(menuItems.filter((item) => item.id !== id && item.parent_id !== id));
  };

  const updateItem = (id: string, field: keyof MenuItem, value: any) => {
    setMenuItems(menuItems.map((item) => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const saveMenu = async () => {
    setSaving(true);
    try {
      const { data: existingData } = await supabase.from('menu_items').select('id');
      const existingIds = existingData?.map(d => d.id) || [];
      const currentIds = menuItems.filter(item => !item.id.startsWith('temp-')).map(item => item.id);
      const idsToDelete = existingIds.filter(id => !currentIds.includes(id));

      if (idsToDelete.length > 0) {
        await supabase.from('menu_items').delete().in('id', idsToDelete);
      }

      const parents = menuItems.filter(i => !i.parent_id);

      // Map each parent's local id (incl. temp ids) to its real DB id.
      // Inserting new parents one-by-one guarantees an unambiguous mapping —
      // matching by label/path can collide when two new parents share defaults.
      const parentIdMap = new Map<string, string>();
      for (let index = 0; index < parents.length; index++) {
        const item = parents[index];
        const row = {
          label_ko: item.label_ko,
          label_en: item.label_en,
          path: item.path,
          order: index + 1,
          is_active: item.is_active,
          parent_id: null
        };

        if (item.id.startsWith('temp-')) {
          const { data: inserted, error: insertError } = await supabase
            .from('menu_items')
            .insert(row)
            .select()
            .single();
          if (insertError) throw insertError;
          parentIdMap.set(item.id, inserted.id);
        } else {
          const { error: updateError } = await supabase
            .from('menu_items')
            .update(row)
            .eq('id', item.id);
          if (updateError) throw updateError;
          parentIdMap.set(item.id, item.id);
        }
      }

      const childrenData: any[] = [];
      parents.forEach((parent) => {
        const realParentId = parentIdMap.get(parent.id);

        const children = menuItems.filter(i => i.parent_id === parent.id);
        children.forEach((child, cIndex) => {
          childrenData.push({
            id: child.id.startsWith('temp-') ? undefined : child.id,
            label_ko: child.label_ko,
            label_en: child.label_en,
            path: child.path,
            order: cIndex + 1,
            is_active: child.is_active,
            parent_id: realParentId
          });
        });
      });

      if (childrenData.length > 0) {
        const { error: childError } = await supabase.from('menu_items').upsert(childrenData);
        if (childError) throw childError;
      }

      alert('메뉴가 성공적으로 저장되었습니다.');
      fetchMenu();
    } catch (error: any) {
      alert('저장 실패: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const rootItems = useMemo(() => menuItems.filter(i => !i.parent_id), [menuItems]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold">네비게이션 메뉴 관리</h2>
          <p className="text-sm text-gray-500 mt-1">드래그하여 순서를 변경하고 서브메뉴를 구성하세요.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => addItem(null)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-bold transition-colors"
          >
            <Plus className="w-4 h-4" /> 대메뉴 추가
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
          items={rootItems.map(i => i.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {rootItems.map((item) => (
              <div key={item.id} className="space-y-2">
                <SortableItem 
                  item={item} 
                  onRemove={removeItem}
                  onUpdate={updateItem}
                  onAddChild={() => addItem(item.id)}
                  isExpanded={expandedParents.has(item.id)}
                  onToggleExpand={() => toggleExpand(item.id)}
                  hasChildren={menuItems.some(i => i.parent_id === item.id)}
                />
                
                {expandedParents.has(item.id) && (
                  <div className="ml-12 space-y-2 border-l-2 border-gray-100 dark:border-gray-800 pl-4">
                    <SortableContext
                      items={menuItems.filter(i => i.parent_id === item.id).map(i => i.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {menuItems.filter(i => i.parent_id === item.id).map((child) => (
                        <SortableItem 
                          key={child.id} 
                          item={child} 
                          onRemove={removeItem}
                          onUpdate={updateItem}
                          isChild
                        />
                      ))}
                    </SortableContext>
                  </div>
                )}
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {rootItems.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
          <p className="text-gray-400">메뉴 항목이 없습니다. '대메뉴 추가'를 눌러 시작하세요.</p>
        </div>
      )}
    </div>
  );
};

interface SortableItemProps {
  item: MenuItem;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof MenuItem, value: any) => void;
  onAddChild?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  hasChildren?: boolean;
  isChild?: boolean;
}

const SortableItem = ({ 
  item, 
  onRemove, 
  onUpdate, 
  onAddChild, 
  isExpanded, 
  onToggleExpand, 
  hasChildren,
  isChild 
}: SortableItemProps) => {
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
      className={`bg-white dark:bg-gray-800 p-3 rounded-xl border ${
        isDragging ? 'border-blue-500 shadow-xl opacity-90' : 'border-gray-200 dark:border-gray-700 shadow-sm'
      } flex flex-col sm:flex-row items-start sm:items-center gap-3 group transition-shadow ${isChild ? 'bg-gray-50/50' : ''}`}
    >
      <div 
        {...attributes} 
        {...listeners}
        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing text-gray-400"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {!isChild && (
        <button 
          onClick={onToggleExpand}
          className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        >
          {hasChildren ? <ChevronDown className="w-4 h-4 text-blue-600" /> : <ChevronRight className="w-4 h-4 text-gray-300" />}
        </button>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        <div className="space-y-1">
          <input
            type="text"
            value={item.label_ko}
            onChange={(e) => onUpdate(item.id, 'label_ko', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            placeholder="한국어 라벨"
          />
        </div>
        <div className="space-y-1">
          <input
            type="text"
            value={item.label_en}
            onChange={(e) => onUpdate(item.id, 'label_en', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            placeholder="English Label"
          />
        </div>
        <div className="space-y-1">
          <input
            type="text"
            value={item.path}
            onChange={(e) => onUpdate(item.id, 'path', e.target.value)}
            className="w-full px-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="경로 (/#section)"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 self-end sm:self-center">
        {!isChild && (
          <button
            onClick={onAddChild}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            title="서브메뉴 추가"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onUpdate(item.id, 'is_active', !item.is_active)}
          className={`p-1.5 rounded-lg transition-colors ${
            item.is_active 
              ? 'text-green-600 hover:bg-green-50' 
              : 'text-gray-400 hover:bg-gray-100'
          }`}
        >
          {item.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
        <button
          onClick={() => onRemove(item.id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MenuAdmin;
