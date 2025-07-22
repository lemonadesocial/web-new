import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type PostTextareaProps = {
  placeholder?: string;
  value: string;
  setValue: (value: string) => void;
  className?: string;
  onFocus?: () => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export const PostTextarea = ({
  placeholder,
  value,
  setValue,
  className,
  onFocus,
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
      return `<span class="text-accent-400 hover:underline cursor-pointer break-all">${match}</span>`;
    });
  };

  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  return (
    <div className="relative min-h-[24px] max-h-[200px] overflow-y-auto no-scrollbar">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={twMerge(
          'absolute inset-0 w-full h-full resize-none outline-none font-medium text-lg placeholder-quaternary bg-transparent text-transparent overflow-auto whitespace-pre-wrap break-words',
          className,
        )}
        onFocus={onFocus}
        autoFocus={autoFocus}
        rows={1}
        disabled={disabled}
        onScroll={handleScroll}
      />

      <div
        ref={highlightRef}
        className="top-0 inset-0 resize-none outline-none font-medium text-lg placeholder-quaternary bg-transparent overflow-y-auto whitespace-pre-wrap break-words"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: highlightLinks(value) }}
      />
    </div>
  );
};
