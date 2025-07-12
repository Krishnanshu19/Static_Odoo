'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Smile
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Write your content here...'
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        placeholder,
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addEmoji = () => {
    const emoji = window.prompt('Enter emoji:');
    if (emoji) {
      editor.chain().focus().insertContent(emoji).run();
    }
  };

  return (
    <div className="border border-gray-600 rounded-lg overflow-hidden">
      <div className="editor-toolbar">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`editor-button ${editor.isActive('bold') ? 'active' : ''}`}
        >
          <Bold className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`editor-button ${editor.isActive('italic') ? 'active' : ''}`}
        >
          <Italic className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`editor-button ${editor.isActive('strike') ? 'active' : ''}`}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-500" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`editor-button ${editor.isActive('bulletList') ? 'active' : ''}`}
        >
          <List className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`editor-button ${editor.isActive('orderedList') ? 'active' : ''}`}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-500" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          className={`editor-button ${editor.isActive('link') ? 'active' : ''}`}
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addImage}
          className="editor-button"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addEmoji}
          className="editor-button"
        >
          <Smile className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-gray-500" />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`editor-button ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`editor-button ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`editor-button ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;