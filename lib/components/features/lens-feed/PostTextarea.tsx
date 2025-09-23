import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { twMerge } from 'tailwind-merge';

import TextEditor, { TextEditorRef } from '$lib/components/core/text-editor/text-editor';

type PostTextareaProps = {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  onSelectionChange?: () => void;
};

export interface PostTextareaRef {
  insertEmoji: (emoji: string) => void;
  toggleBold: () => void;
  toggleItalic: () => void;
  isBoldActive: () => boolean;
  isItalicActive: () => boolean;
}

const PostTextarea = forwardRef<PostTextareaRef, PostTextareaProps>(({
  placeholder,
  value,
  setValue,
  className,
  onFocus,
  onBlur,
  disabled,
  onSelectionChange,
}, ref) => {
  const editorRef = useRef<TextEditorRef>(null);
  const simpleToolbar = {
    bubble: null,
    float: null,
  };

  const handleChange = (html: string) => {
    setValue(html);
  };

  useEffect(() => {
    if (value === '' && editorRef.current) {
      editorRef.current.commands.clearContent();
    }
  }, [value]);

  useImperativeHandle(ref, () => ({
    insertEmoji: (emoji: string) => {
      if (editorRef.current) {
        editorRef.current.commands.insertContent(emoji);
      }
    },
    toggleBold: () => {
      if (editorRef.current) {
        editorRef.current.commands.toggleBold();
      }
    },
    toggleItalic: () => {
      if (editorRef.current) {
        editorRef.current.commands.toggleItalic();
      }
    },
    isBoldActive: () => {
      return editorRef.current?.isActive.bold() ?? false;
    },
    isItalicActive: () => {
      return editorRef.current?.isActive.italic() ?? false;
    },
  }), []);

  return (
    <div className={twMerge('min-h-[24px] max-h-[200px]', className)}>
      <TextEditor
        ref={editorRef}
        directory="post"
        content={value}
        onChange={handleChange}
        placeholder={placeholder}
        toolbar={simpleToolbar}
        containerClass="border-none hover:border-none focus:border-none px-0 py-0 min-h-[24px] font-medium text-lg"
        readOnly={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
});

PostTextarea.displayName = 'PostTextarea';

export { PostTextarea };
