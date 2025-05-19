import { StarterKit } from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Markdown } from "tiptap-markdown";
import CharacterCount from "@tiptap/extension-character-count";
import { SlashCommand } from "novel/extensions";
import { suggestionItems } from "./slash-command";

// Create a slash command with our suggestion items
export const slashCommand = SlashCommand.configure({
  suggestion: {
    items: () => suggestionItems,
  },
});

// Default extensions with slash command
export const defaultExtensions = [
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
  Markdown.configure({
    html: false,
    transformPastedText: true,
    transformCopiedText: true,
  }),
  slashCommand,
];
