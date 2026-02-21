import { useRef } from 'react';

export function ImageInput({ value, onChange }: { value: File[]; onChange: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    onChange([...value, ...fileArray]);
  };

  const handleRemove = (index: number) => {
    const newFiles = value.slice();
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex gap-2">
      {value.map((file, idx) => {
        const url = URL.createObjectURL(file);
      
        return (
          <div key={idx} className="relative group">
            <img src={url} alt={file.name} className="w-35 h-35 object-cover rounded-sm border border-card-border" />
            <button
              type="button"
              className="absolute top-3 right-3 bg-overlay-secondary rounded-full w-6 h-6 flex items-center justify-center"
              onClick={() => handleRemove(idx)}
            >
              <i aria-hidden="true" className="icon-x text-tertiary size-[14px]" />
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={openFileDialog}
        className="w-35 h-35 flex items-center justify-center rounded-sm bg-card border-dashed border-2"
      >
        <i aria-hidden="true" className="icon-plus text-tertiary size-8" />
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
} 