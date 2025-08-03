import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type PostTextareaProps = {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export const PostTextarea = ({
  placeholder,
  value,
  setValue,
  className,
  onFocus,
  onBlur,
  disabled,
  autoFocus,
}: PostTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  const highlightLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

    return text.replace(urlRegex, (match) => {
      return `<span class="text-accent-400 hover:underline cursor-pointer">${match}</span>`;
    });
  };

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className={twMerge('relative min-h-[24px] max-h-[200px] overflow-y-auto no-scrollbar', className)}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={twMerge(
          'absolute inset-0 w-full h-auto resize-none outline-none font-medium text-lg placeholder-quaternary bg-transparent text-transparent overflow-auto whitespace-pre-wrap break-words bg-transparent text-transparent caret-primary min-h-[24px]',
        )}
        onFocus={onFocus}
        onBlur={onBlur}
        autoFocus={autoFocus}
        rows={1}
        disabled={disabled}
        onScroll={handleScroll}
      />

      <div
        ref={highlightRef}
        className={twMerge(
          'top-0 inset-0 resize-none outline-none font-medium text-lg placeholder-quaternary bg-transparent overflow-y-auto whitespace-pre-wrap break-words min-h-[24px]',
        )}
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: highlightLinks(value) }}
      />
    </div>
  );
};
