import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Code } from 'lucide-react';

export const TextButtons = () => {
  const items = [
    {
      name: "Bold",
      icon: <Bold size={16} />,
      command: (editor) => editor.chain().focus().toggleBold().run(),
      isActive: (editor) => editor.isActive("bold"),
    },
    {
      name: "Italic",
      icon: <Italic size={16} />,
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      isActive: (editor) => editor.isActive("italic"),
    },
    {
      name: "Underline",
      icon: <Underline size={16} />,
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      isActive: (editor) => editor.isActive("underline"),
    },
    {
      name: "Strikethrough",
      icon: <Strikethrough size={16} />,
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      isActive: (editor) => editor.isActive("strike"),
    },
    {
      name: "Code",
      icon: <Code size={16} />,
      command: (editor) => editor.chain().focus().toggleCode().run(),
      isActive: (editor) => editor.isActive("code"),
    },
  ];

  return (
    <div className="flex items-center gap-1">
      {items.map((item) => (
        <button
          key={item.name}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-neutral-800"
          title={item.name}
          onClick={() => {
            // In a real implementation, this would use the editor from context
            // item.command(editor);
          }}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};
