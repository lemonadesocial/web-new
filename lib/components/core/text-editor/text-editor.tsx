'use client';
import React, { forwardRef, useImperativeHandle } from 'react';
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
  label?: string;
  content?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  toolbar?: any;
  containerClass?: string;
  /** directory prop is using for upload file */
  directory?: FileDirectory;
  readOnly?: boolean;
  onFocus?: React.FocusEventHandler<HTMLDivElement>;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
};

export interface TextEditorRef {
  commands: {
    clearContent: () => void;
    insertContent: (content: string) => void;
  };
}

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

const TextEditor = forwardRef<TextEditorRef, TextEditorProps>(({
  content = '',
  placeholder = 'Write something …',
  containerClass = '',
  onChange,
  toolbar = defaulToolBar,
  directory = 'event',
  readOnly = false,
  onFocus,
  onBlur,
  label,
}, ref) => {
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
          'tiptap border hover:border-quaternary focus:border-primary px-3 py-2.5 min-h-[110px] rounded-sm outline-none',
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

  useImperativeHandle(ref, () => ({
    commands: {
      clearContent: () => editor?.commands.clearContent(),
      insertContent: (content: string) => editor?.commands.insertContent(content),
    },
  }), [editor]);

  if (!editor) return null;

  return (
    <>
      <TextEditorBubbleMenu editor={editor} toolbar={toolbar.bubble} />
      {
        toolbar.float && (
          <TextEditorFloatingMenu editor={editor} toolbar={toolbar.float} directory={directory} />
        )
      }
      <div className="flex flex-col gap-[6px]">
        {label && <label className="text-secondary text-sm font-medium">{label}</label>}
        <EditorContent editor={editor} onFocus={onFocus} onBlur={onBlur} />
      </div>
    </>
  );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor;
