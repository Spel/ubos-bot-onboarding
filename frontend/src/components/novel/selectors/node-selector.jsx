import React from 'react';
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Text, 
  TextQuote, 
  Code,
  CheckSquare
} from 'lucide-react';

export const NodeSelector = ({ open, onOpenChange }) => {
  const items = [
    {
      name: "Text",
      icon: <Text size={16} />,
      command: (editor) => editor.chain().focus().setParagraph().run(),
      isActive: (editor) => editor.isActive("paragraph"),
    },
    {
      name: "Heading 1",
      icon: <Heading1 size={16} />,
      command: (editor) => editor.chain().focus().setHeading({ level: 1 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 1 }),
    },
    {
      name: "Heading 2",
      icon: <Heading2 size={16} />,
      command: (editor) => editor.chain().focus().setHeading({ level: 2 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 2 }),
    },
    {
      name: "Heading 3",
      icon: <Heading3 size={16} />,
      command: (editor) => editor.chain().focus().setHeading({ level: 3 }).run(),
      isActive: (editor) => editor.isActive("heading", { level: 3 }),
    },
    {
      name: "Bullet List",
      icon: <List size={16} />,
      command: (editor) => editor.chain().focus().toggleBulletList().run(),
      isActive: (editor) => editor.isActive("bulletList"),
    },
    {
      name: "Numbered List",
      icon: <ListOrdered size={16} />,
      command: (editor) => editor.chain().focus().toggleOrderedList().run(),
      isActive: (editor) => editor.isActive("orderedList"),
    },
    {
      name: "Quote",
      icon: <TextQuote size={16} />,
      command: (editor) => editor.chain().focus().toggleBlockquote().run(),
      isActive: (editor) => editor.isActive("blockquote"),
    },
    {
      name: "Code",
      icon: <Code size={16} />,
      command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
      isActive: (editor) => editor.isActive("codeBlock"),
    },
    {
      name: "Task List",
      icon: <CheckSquare size={16} />,
      command: (editor) => editor.chain().focus().toggleTaskList().run(),
      isActive: (editor) => editor.isActive("taskList"),
    },
  ];

  // In a full implementation, this would be a dropdown with all the node types
  // For simplicity, we'll just render the buttons
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
