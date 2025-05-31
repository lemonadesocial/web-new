import { useRef } from 'react';

type FileInputProps = {
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  children: (open: () => void) => React.ReactNode;
};

export function FileInput({ 
  onChange, 
  accept = 'image/*', 
  multiple = true,
  children 
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const open = () => {
    inputRef.current?.click();
  };

  return (
    <>
      {children(open)}
      <input
        ref={inputRef}
        type="file"
        multiple={multiple}
        className="hidden"
        accept={accept}
        onChange={e => onChange(e.target.files ? Array.from(e.target.files) : [])}
      />
    </>
  );
}
