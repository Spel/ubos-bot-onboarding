// Slash command items for the Novel editor
export const suggestionItems = [
  {
    title: 'Text',
    description: 'Just start typing with plain text.',
    searchTerms: ['p', 'paragraph'],
    icon: 'text',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('paragraph').run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['title', 'big', 'large'],
    icon: 'h1',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['subtitle', 'medium'],
    icon: 'h2',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['subtitle', 'small'],
    icon: 'h3',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    searchTerms: ['unordered', 'point'],
    icon: 'list',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    searchTerms: ['ordered'],
    icon: 'listOrdered',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'Task List',
    description: 'Track tasks with a to-do list.',
    searchTerms: ['todo', 'task', 'list'],
    icon: 'listTodo',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    searchTerms: ['snippet'],
    icon: 'code',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run();
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    searchTerms: ['blockquote'],
    icon: 'quote',
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).setBlockquote().run(),
  },
  {
    title: 'Divider',
    description: 'Visually divide blocks.',
    searchTerms: ['line', 'divider', 'hr'],
    icon: 'separator',
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];

export default suggestionItems;
