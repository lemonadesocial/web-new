import { useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

type PostTextareaProps = {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  className?: string;
  onFocus?: () => void;
  disabled?: boolean;
};

export const PostTextarea = ({ placeholder, value, setValue, className, onFocus, disabled }: PostTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      className={twMerge('w-full bg-transparent border-none outline-none font-medium text-lg placeholder-quaternary resize-none overflow-hidden min-h-[24px] max-h-[200px]', className)}
      onFocus={onFocus}
      rows={1}
      disabled={disabled}
    />
  );
};
