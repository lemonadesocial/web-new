import { useState } from "react";
import { useAtomValue } from "jotai";

import { Avatar, Button, modal, toast } from "$lib/components/core";
import { MediaFile, uploadFiles } from "$lib/utils/file";
import { generatePostMetadata, getAccountAvatar } from "$lib/utils/lens/utils";
import { accountAtom } from "$lib/jotai";
import { randomUserImage } from "$lib/utils/user";
import { useLensAuth } from "$lib/hooks/useLens";
import { useMediaQuery } from "$lib/hooks/useMediaQuery";
import { Event } from "$lib/graphql/generated/backend/graphql";

import { ImageInput } from "./ImageInput";
import { AddEventModal } from "./AddEventModal";
import { EventPreview } from "./EventPreview";
import { PostTextarea } from "./PostTextarea";
import { FileInput } from "../../core/file-input/file-input";
import { ProfileMenu } from "../lens-account/ProfileMenu";

type PostComposerProps = {
  placeholder?: string;
  onPost: (metadata: unknown) => Promise<void>;
};

export function PostComposer({ placeholder, onPost }: PostComposerProps) {
  const account = useAtomValue(accountAtom);
  const isDesktop = useMediaQuery('md');

  const [value, setValue] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [event, setEvent] = useState<Event | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(false);

  const handleLensAuth = useLensAuth();

  const handlePost = async () => {
    const content = value.trim();
    let images: MediaFile[] = [];

    if (files.length > 0) {
      setIsUploading(true);
      images = await uploadFiles(files, 'post');
      setIsUploading(false);
    }

    try {
      setIsLoading(true);
      await onPost(generatePostMetadata({ content, images, event }));
      setIsLoading(false);
      setValue('');
      setFiles([]);
      setEvent(undefined);
      setIsActive(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-card-border rounded-md px-4 py-3 flex gap-3">
      <Avatar src={account ? getAccountAvatar(account) : randomUserImage()} size="xl" rounded="full" />

      <div className="space-y-4 flex-1">
        <PostTextarea
          value={value}
          setValue={setValue}
          placeholder={placeholder || `What's on your mind?`}
          onFocus={() => setIsActive(true)}
          className="mt-2"
        />

        {
          files.length > 0 && <ImageInput value={files} onChange={setFiles} />
        }

        {
          event && (
            <div className="relative">
              <EventPreview event={event} />
              <Button
                icon="icon-x size-[14]"
                variant="tertiary"
                className="rounded-full absolute top-3 right-3"
                size="xs"
                onClick={() => setEvent(undefined)}
              />
            </div>
          )
        }

        {isActive && (
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <FileInput
                onChange={setFiles}
                accept="image/*"
                multiple
              >
                {open => (
                  <Button
                    icon="icon-image"
                    variant="tertiary"
                    className="rounded-full"
                    onClick={open}
                  />
                )}
              </FileInput>
              <Button
                icon="icon-celebration"
                variant="tertiary"
                className="rounded-full"
                onClick={() => {
                  modal.open(AddEventModal, {
                    props: {
                      onConfirm: setEvent,
                    },
                    dismissible: true
                  });
                }}
              />
            </div>
            <Button
              variant="primary"
              className="rounded-full"
              disabled={!value.trim() || isLoading}
              onClick={() => handleLensAuth(handlePost)}
              loading={isLoading || isUploading}
            >
              Post
            </Button>
          </div>
        )}
      </div>

      {
        !!(account && !isDesktop) && (
          <ProfileMenu>
            <i className="icon-more-vert size-5 text-tertiary cursor-pointer" />
          </ProfileMenu>
        )
      }
    </div>
  );
}
