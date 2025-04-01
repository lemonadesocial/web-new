import { useMe } from "$lib/hooks/useMe";
import { userAvatar } from "$lib/utils/user";
import { Card, Avatar } from "$lib/components/core";

export function AccessCard({ children }: { children: React.ReactNode }) {
  const me = useMe();

  return (
    <Card.Root className="p-4 flex flex-col gap-4">
      {me && (
        <div className="flex justify-between">
          <Avatar src={userAvatar(me)} className="size-12" />
        </div>
      )}
      {children}
    </Card.Root>
  );
}
