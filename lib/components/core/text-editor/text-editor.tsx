'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import CodeBlock from '@tiptap/extension-code-block';
import Strike from '@tiptap/extension-strike';
import Link from '@tiptap/extension-link';

import { FileDirectory } from '$lib/utils/file';

import TextEditorBubbleMenu from './bubble-menu';
import TextEditorFloatingMenu from './floating-menu';
import { ImageResize } from './resize-image';

type TextEditorProps = {
  content?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  toolbar?: any;
  containerClass?: string;
  /** directory prop is using for upload file */
  directory?: FileDirectory;
  readOnly?: boolean;
};

const defaulToolBar = {
  bubble: {
    heading: [1, 2],
    bold: true,
    italic: true,
    underline: true,
    strike: true,
    link: true,
    blockquote: true,
    bullet_list: true,
    ordered_list: true,
    code_block: true,
  },
  float: {
    heading: {
      level: [1, 2],
      label: ['Heading', 'Subheading'],
    },
    image: { enable: true, label: 'Image' },
    divider: { enable: true, label: 'Divider' },
    blockquote: { enable: true, label: 'Blockquote' },
    bullet_list: { enable: true, label: 'List' },
    ordered_list: { enable: true, label: 'Numbered List' },
  },
};

export default function TextEditor({
  content = '',
  placeholder = 'Write something …',
  containerClass = '',
  onChange,
  toolbar = defaulToolBar,
  directory = 'event',
  readOnly = false,
}: TextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder, showOnlyWhenEditable: false }),
      Underline,
      Strike,
      CodeBlock,
      Link.configure({ autolink: true }),
      ImageResize.configure({ inline: true, allowBase64: true }),
    ],
    content,
    editorProps: {
      attributes: {
        class: twMerge(
          'tiptap border hover:border-primary focus:border-primary px-3 py-2.5 min-h-[110px] text-sm rounded-sm outline-none',
          containerClass,
        ),
      },
    },
    onUpdate({ editor }) {
      // Only send content if it's not empty
      if (editor.isEmpty) {
        onChange?.('');
      } else {
        onChange?.(editor.getHTML());
      }
    },
  });

  React.useEffect(() => {
    if (!editor) {
      return undefined;
    }

    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  if (!editor) return null;

  return (
    <>
      <TextEditorBubbleMenu editor={editor} toolbar={toolbar.bubble} />
      <TextEditorFloatingMenu editor={editor} toolbar={toolbar.float} directory={directory} />
      <EditorContent editor={editor} />
    </>
  );
}
