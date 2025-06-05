import { Post } from "@lens-protocol/client";
import { useState } from "react";
import clsx from "clsx";

import { Button, modal, toast } from "$lib/components/core";
import { useComments } from "$lib/hooks/useLens";
import { uploadFiles } from "$lib/utils/file";
import { MediaFile } from "$lib/utils/file";
import { generatePostMetadata } from "$lib/utils/lens/utils";

import { PostHeader } from "./PostHeader";
import { PostContent } from "./PostContent";
import { PostTextarea } from "./PostTextarea";
import { FileInput } from "../../core/file-input/file-input";
import { AddEventModal } from "./AddEventModal";
import { ImageInput } from "./ImageInput";
import { EventPreview } from "./EventPreview";

type AddCommentModalProps = {
  post: Post;
  onSuccess: () => void;
};

export function AddCommentModal({ post, onSuccess }: AddCommentModalProps) {
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [sharingLink, setSharingLink] = useState<string | undefined>(undefined);
  const {createComment} = useComments({ postId: post.id });

  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onPost = async () => {
    if (!content) return;

    let images: MediaFile[] = [];

    if (files.length > 0) {
      setIsUploading(true);
      images = await uploadFiles(files, 'post');
      setIsUploading(false);
    }

    try {
      setIsLoading(true);
      const metadata = generatePostMetadata({ content, images, sharingLink });
      await createComment(metadata);
      setIsLoading(false);
      modal.close();
      toast.success('Comment posted');
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[480px] max-w-full">
      <div className="p-4 space-y-3">
        <PostHeader post={post} />
        <PostContent post={post} />
      </div>
      <hr className="border-t" />
      <div className="p-4 space-y-1.5">
        <p className="text-sm">Replying to {post.author.username?.localName}</p>
        <div className="py-2.5 px-3.5 space-y-3 rounded-sm border border-white bg-woodsmoke-950/64">
          <PostTextarea
            value={content}
            setValue={setContent}
            placeholder="Add a comment..."
            className="text-base"
          />

          {
            files.length > 0 && <ImageInput value={files} onChange={setFiles} />
          }

          {
            sharingLink && (
              <div className="relative">
                <EventPreview url={sharingLink} />
                <Button
                  icon="icon-x size-[14]"
                  variant="tertiary"
                  className="rounded-full absolute top-3 right-3"
                  size="xs"
                  onClick={() => setSharingLink(undefined)}
                />
              </div>
            )
          }
          <div className="flex justify-between">
            <div className="flex gap-3">
              <FileInput
                onChange={setFiles}
                accept="image/*"
                multiple
              >
                {open => <i className="icon-image size-5 text-tertiary hover:text-primary cursor-pointer" onClick={open} />}
              </FileInput>
              <i
                className="icon-celebration size-5 text-tertiary hover:text-primary cursor-pointer"
                onClick={() => {
                  modal.open(AddEventModal, {
                    props: {
                      onConfirm: link => setSharingLink(link),
                    },
                    dismissible: true
                  });
                }}
              />
            </div>
            <i
              className={clsx(' size-5 text-tertiary hover:text-primary cursor-pointer', isLoading || isUploading ? 'icon-loader animate-spin' : 'icon-send')}
              onClick={onPost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
