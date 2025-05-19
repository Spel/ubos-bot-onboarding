import React, { useState } from 'react';
import { EditorContent, EditorRoot } from 'novel';
import { useDebouncedCallback } from 'use-debounce';
import { handleCommandNavigation, handleImageDrop, handleImagePaste } from 'novel';
import { StarterKit } from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import CharacterCount from '@tiptap/extension-character-count';
import { uploadFn } from './image-upload';

// Import the suggestionItems for slash commands
import { suggestionItems } from './slash-command';

// Define our extensions
const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
  Placeholder.configure({
    placeholder: "Type '/' for commands...",
  }),
  // Novel has built-in slash command support, we don't need to add it explicitly
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
  Highlight,
  Image.configure({
    allowBase64: true,
    HTMLAttributes: {
      class: "rounded-lg border border-gray-200 dark:border-neutral-700",
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      rel: "noopener noreferrer",
      target: "_blank",
    },
  }),
  Underline,
  TextStyle,
  Color,
  CharacterCount.configure({
    limit: 50000,
  }),
];

// A simplified Novel editor component that uses the built-in slash commands
const NovelEditor = ({ initialContent, darkMode, onUpdate }) => {
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [wordCount, setWordCount] = useState(0);
  
  // Debounced update function to avoid too many updates
  const debouncedUpdates = useDebouncedCallback(async (editor) => {
    const json = editor.getJSON();
    onUpdate(json);
    setWordCount(editor.storage.characterCount.words());
    setSaveStatus('Saved');
  }, 500);

  return (
    <div className={`border rounded-lg overflow-hidden ${darkMode ? 'border-neutral-700' : 'border-gray-200'}`}>
      <EditorRoot className={darkMode ? 'novel-dark-theme' : ''}>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus('Unsaved');
          }}
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: `prose prose-lg ${darkMode ? 'prose-invert' : ''} prose-headings:font-title font-default focus:outline-none max-w-full min-h-[300px]`,
            },
          }}
        />
      </EditorRoot>
      <div className="flex justify-between px-3 py-1 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-neutral-700">
        <div>{wordCount > 0 ? `${wordCount} words` : ''}</div>
        <div>{saveStatus}</div>
      </div>
    </div>
  );
};

export default NovelEditor;
