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
};

export interface PostTextareaRef {
  insertEmoji: (emoji: string) => void;
}

const PostTextarea = forwardRef<PostTextareaRef, PostTextareaProps>(({
  placeholder,
  value,
  setValue,
  className,
  onFocus,
  onBlur,
  disabled,
}, ref) => {
  const editorRef = useRef<TextEditorRef>(null);
  const simpleToolbar = {
    bubble: {
      bold: true,
      italic: true,
    },
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
      />
    </div>
  );
});

PostTextarea.displayName = 'PostTextarea';

export { PostTextarea };
