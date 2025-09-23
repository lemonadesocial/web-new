import { EmojiPicker, FileInput, modal } from "$lib/components/core";
import { Event } from "$lib/graphql/generated/backend/graphql";
import { AddEventModal } from "./AddEventModal";
import { GifPicker } from "./GifPicker";

export function PostToolbar({
  onSelectFiles,
  onAddEvent,
  onSelectEmoji,
  onSelectGif,
  onSelectBold,
  onSelectItalic,
  isBoldActive,
  isItalicActive,
}: {
  onAddEvent: (event?: Event) => void;
  onSelectFiles: (files: File[]) => void;
  onSelectEmoji: (emoji: string) => void;
  onSelectGif: (gifUrl: string) => void;
  onSelectBold: () => void;
  onSelectItalic: () => void;
  isBoldActive?: boolean;
  isItalicActive?: boolean;
}) {
  return (
    <div className="flex gap-4 items-center">
      <i 
        className={`icon-format-bold size-5 cursor-pointer ${isBoldActive ? 'text-primary' : 'text-tertiary'}`} 
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onSelectBold();
        }} 
      />

      <i 
        className={`icon-format-italic size-5 cursor-pointer ${isItalicActive ? 'text-primary' : 'text-tertiary'}`} 
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          onSelectItalic();
        }} 
      />

      <div className="bg-primary/8 h-4 w-0.5" />

      <EmojiPicker onSelect={onSelectEmoji} />

      <GifPicker onSelectGif={onSelectGif} />

      <FileInput onChange={onSelectFiles} accept="image/*" multiple className="flex">
        {(open) => <i className="icon-image size-5 text-[#60A5FA] cursor-pointer" onClick={open} />}
      </FileInput>
      
      <i
        className="icon-ticket size-5 text-[#A78BFA] cursor-pointer"
        onClick={() => {
          modal.open(AddEventModal, {
            props: {
              onConfirm: onAddEvent,
            },
          });
        }}
      />
    </div>
  );
}
