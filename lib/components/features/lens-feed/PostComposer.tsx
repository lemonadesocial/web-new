import { useState, useRef, useEffect } from "react";
import { useAtomValue } from "jotai";

import { Avatar, Button } from "$lib/components/core";
import { MediaFile, uploadFiles } from "$lib/utils/file";
import { generatePostMetadata, getAccountAvatar } from "$lib/utils/lens/utils";
import { accountAtom } from "$lib/jotai";
import { randomUserImage } from "$lib/utils/user";

import { ImageInput } from "./ImageInput";

type PostComposerProps = {
  placeholder?: string;
  onPost: (metadata: unknown) => Promise<void>;
};

export function PostComposer({ placeholder, onPost }: PostComposerProps) {
  const account = useAtomValue(accountAtom);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [isActive, setIsActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  const handlePost = async () => {
    const content = value.trim();
    let images: MediaFile[] = [];

    if (files.length > 0) {
      setIsUploading(true);
      images = await uploadFiles(files, 'post');
      setIsUploading(false);
    }
    
    setIsLoading(true);
    await onPost(generatePostMetadata({ content, images }));
    setIsLoading(false);
    setValue('');
    setFiles([]);
    setIsActive(false);
  };

  return (
    <div className="bg-card border border-card-border rounded-md px-4 py-3 flex gap-3">
      <Avatar src={account ? getAccountAvatar(account) : randomUserImage()} size="xl" rounded="full" />

      <div className="space-y-4 flex-1">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={account ? placeholder || `What's on your mind, ${account?.username?.localName}?` : 'Please connect your wallet to post'}
          className="w-full bg-transparent border-none outline-none font-medium text-lg mt-2 placeholder-quaternary resize-none overflow-hidden min-h-[24px] max-h-[200px]"
          onFocus={() => setIsActive(true)}
          rows={1}
          disabled={!account}
        />
        {
          files.length > 0 && <ImageInput value={files} onChange={setFiles} />
        }
        {isActive && (
          <div className="flex items-center justify-between">
            <Button icon="icon-image" variant="tertiary" className="rounded-full" onClick={() => inputRef.current?.click()} />
            <Button 
              variant="primary" 
              className="rounded-full" 
              disabled={!value.trim() || isLoading}
              onClick={handlePost}
              loading={isLoading || isUploading}
            >
              Post
            </Button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept="image/*"
        onChange={e => setFiles(e.target.files ? Array.from(e.target.files) : [])}
      />
    </div>
  );
}
