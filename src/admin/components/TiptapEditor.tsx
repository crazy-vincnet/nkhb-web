import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import YouTube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, 
  Youtube, Link as LinkIcon, Table as TableIcon,
  Heading1, Heading2
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('이미지 URL을 입력하세요:');
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('유튜브 URL을 입력하세요:');
    if (url) editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('링크 URL을 입력하세요:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btnClass = (active: boolean) => `
    p-2 rounded-lg transition-all
    ${active ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}
  `;

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 sticky top-0 z-20 backdrop-blur-sm">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="굵게"><Bold size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="기울임"><Italic size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="밑줄"><UnderlineIcon size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))} title="취소선"><Strikethrough size={18} /></button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />
      
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="대제목"><Heading1 size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="중제목"><Heading2 size={18} /></button>
      
      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

      <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="왼쪽 정렬"><AlignLeft size={18} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="가운데 정렬"><AlignCenter size={18} /></button>
      <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="오른쪽 정렬"><AlignRight size={18} /></button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="글머리 기호"><List size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="번호 매기기"><ListOrdered size={18} /></button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="인용구"><Quote size={18} /></button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

      <button onClick={setLink} className={btnClass(editor.isActive('link'))} title="링크"><LinkIcon size={18} /></button>
      <button onClick={addImage} className={btnClass(false)} title="이미지"><ImageIcon size={18} /></button>
      <button onClick={addYoutubeVideo} className={btnClass(false)} title="유튜브"><Youtube size={18} /></button>
      <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={btnClass(false)} title="표 삽입"><TableIcon size={18} /></button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1 self-center" />

      <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="실행 취소"><Undo size={18} /></button>
      <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="다시 실행"><Redo size={18} /></button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange }: TiptapEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ HTMLAttributes: { class: 'rounded-2xl shadow-lg max-w-full' } }),
      YouTube.configure({ width: 640, height: 480 }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Color,
      Highlight.configure({ multicolor: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <div className="w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-all shadow-sm">
      <MenuBar editor={editor} />
      <div className="p-6 min-h-[500px] prose prose-blue dark:prose-invert max-w-none prose-img:rounded-3xl prose-table:border prose-table:rounded-xl prose-th:bg-gray-50 dark:prose-th:bg-gray-800">
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .ProseMirror { outline: none; min-height: 500px; }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror table { border-collapse: collapse; table-layout: fixed; width: 100%; margin: 0; overflow: hidden; }
        .ProseMirror td, .ProseMirror th { min-width: 1em; border: 2px solid #ced4da; padding: 3px 5px; vertical-align: top; box-sizing: border-box; position: relative; }
        .dark .ProseMirror td, .dark .ProseMirror th { border-color: #374151; }
      `}</style>
    </div>
  );
};

export default TiptapEditor;
