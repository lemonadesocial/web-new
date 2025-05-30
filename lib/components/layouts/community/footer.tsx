import { useRouter } from "next/navigation";
import clsx from "clsx";

import { Space } from "$lib/graphql/generated/backend/graphql";
import { useSpaceMenu } from "./hooks";

export function Footer({ space }: { space: Space }) {
  const { menu, isActive } = useSpaceMenu({ space });
  const router = useRouter();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full p-4 flex justify-center">
      <div className="flex items-center gap-2 p-2 rounded-full border bg-overlay-secondary [backdrop-filter:var(--backdrop-filter)]">
        {menu.map((item) => (
          <div
            key={item.path}
            className={clsx('p-2.5 rounded-full cursor-pointer', isActive(item) && 'bg-[var(--btn-secondary)]')}
            onClick={() => router.push(`/s/${space.slug || space._id}/${item.path}`)}
          >
            <i className={clsx(item.icon, isActive(item) ? 'text-[var(--btn-secondary-content)]' : 'text-secondary')} />
          </div>
        ))}
      </div>
    </div>
  );
}
