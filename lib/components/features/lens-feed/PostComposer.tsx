import { useState } from "react";
import { Avatar, Input, Button } from "$lib/components/core";
import { useMe } from "$lib/hooks/useMe";
import { usePost } from "$lib/hooks/useLens";
import { userAvatar } from "$lib/utils/user";

export function PostComposer({ feedAddress }: { feedAddress?: string }) {
  const me = useMe();
  const { createPost, isLoading } = usePost();
  const [value, setValue] = useState('');
  const [isActive, setIsActive] = useState(false);

  const handlePost = async () => {
    if (!value.trim()) return;
    
    await createPost({ content: value.trim(), feedAddress });
    setValue('');
    setIsActive(false);
  };

  return (
    <div className="bg-card rounded-md px-4 py-3 flex gap-3">
      <Avatar src={userAvatar(me)} size="xl" rounded="full" />

      <div className="space-y-4 flex-1">
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={`What's on your mind, ${me?.username}?`}
          className="w-full bg-transparent border-none outline-none text-white text-lg mt-2 placeholder-quaternary"
          onFocus={() => setIsActive(true)}
        />
        {isActive && (
          <div className="flex items-center justify-between">
            <Button icon="icon-image" variant="tertiary" className="rounded-full" />
            <Button 
              variant="primary" 
              className="rounded-full" 
              disabled={!value.trim() || isLoading}
              onClick={handlePost}
              loading={isLoading}
            >
              Post
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
