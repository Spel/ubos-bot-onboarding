import React, { useEffect } from 'react';
import './RichTextEditor.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 p-1 mb-2 border-b overflow-x-auto">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-1 rounded ${editor.isActive('bold') ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
          <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-1 rounded ${editor.isActive('italic') ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-1 rounded ${editor.isActive('strike') ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <path d="M16 6c-.5-1.8-2.1-3-4-3-2.2 0-4 1.8-4 4 0 1 .3 1.8 1 2.5"></path>
          <path d="M8 18c.5 1.8 2.1 3 4 3 2.2 0 4-1.8 4-4 0-1-.3-1.8-1-2.5"></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-1 rounded ${editor.isActive('code') ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </button>
      <span className="w-px h-6 bg-gray-300 dark:bg-neutral-700 mx-1"></span>
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-1 rounded ${editor.isActive('paragraph') ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 4v16"></path>
          <path d="M19 4H9.5a4.5 4.5 0 0 0 0 9H13"></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h16"></path>
          <path d="M4 6h16"></path>
          <path d="M4 18h12"></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-1 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h10"></path>
          <path d="M4 6h16"></path>
          <path d="M4 18h8"></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-1 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12h8"></path>
          <path d="M4 6h16"></path>
          <path d="M4 18h6"></path>
        </svg>
      </button>
      <span className="w-px h-6 bg-gray-300 dark:bg-neutral-700 mx-1"></span>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-1 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-1 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="21" y2="6"></line>
          <line x1="10" y1="12" x2="21" y2="12"></line>
          <line x1="10" y1="18" x2="21" y2="18"></line>
          <path d="M4 6h1v4"></path>
          <path d="M4 10h2"></path>
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-1 rounded ${editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-neutral-700' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1"></path>
          <path d="M7 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1"></path>
        </svg>
      </button>
      <span className="w-px h-6 bg-gray-300 dark:bg-neutral-700 mx-1"></span>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};

const RichTextEditor = ({ content, onChange, darkMode, placeholder }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(true);
    }
  }, [editor]);

  // Add custom styles for dark mode and handle keyboard shortcuts
  useEffect(() => {
    if (!editor) return;
    
    // Apply dark mode styles to the editor
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      if (darkMode) {
        editorElement.classList.add('dark-editor');
      } else {
        editorElement.classList.remove('dark-editor');
      }
      
      // Add a focus handler to improve UX
      editorElement.addEventListener('focus', () => {
        editorElement.closest('.editor-container')?.classList.add('editor-focused');
      });
      
      editorElement.addEventListener('blur', () => {
        editorElement.closest('.editor-container')?.classList.remove('editor-focused');
      });
    }
    
    // Setup autosave functionality
    const saveInterval = setInterval(() => {
      if (editor.isEmpty) return;
      // Here you would typically save to localStorage or your backend
      console.log('Auto-saving editor content...');
      // localStorage.setItem('editor-content', editor.getHTML());
    }, 30000); // Save every 30 seconds
    
    return () => {
      clearInterval(saveInterval);
      // Clean up event listeners
      if (editorElement) {
        editorElement.removeEventListener('focus', () => {});
        editorElement.removeEventListener('blur', () => {});
      }
    };
  }, [editor, darkMode]);

  return (
    <div className={`editor-container border rounded-lg ${darkMode ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-gray-200 bg-white text-gray-900'}`}>
      <MenuBar editor={editor} />
      <div className="px-4 py-2">
        <EditorContent 
          editor={editor} 
          className={`prose max-w-none focus:outline-none ${darkMode ? 'prose-invert' : ''}`} 
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
