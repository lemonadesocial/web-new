'use client';
import { useRef, useState, useCallback } from 'react';

type FileInputProps = {
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  allowDrop?: boolean;
  children: (open: () => void, isDragOver?: boolean) => React.ReactNode;
  className?: string;
};

export function FileInput({ 
  onChange, 
  accept = 'image/*', 
  multiple = true,
  allowDrop = false,
  children,
  className,
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const open = () => {
    inputRef.current?.click();
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (files) {
      onChange(Array.from(files));
    }
  }, [onChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!allowDrop) return;
    e.preventDefault();
    setIsDragOver(true);
  }, [allowDrop]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    if (!allowDrop) return;
    e.preventDefault();
    setIsDragOver(false);
  }, [allowDrop]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (!allowDrop) return;
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [allowDrop, handleFiles]);

  const Wrapper = allowDrop ? 'div' : 'div';
  const wrapperProps = allowDrop ? {
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop,
  } : {};

  return (
    <Wrapper {...wrapperProps} className={className}>
      {children(open, allowDrop ? isDragOver : undefined)}
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        className="hidden"
        accept={accept}
        onChange={e => handleFiles(e.target.files)}
      />
    </Wrapper>
  );
}
