import { Card } from '$lib/components/core';
import { Pane } from '$lib/components/core/pane/pane';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export function CompleteProfilePane({
  tasks,
}: {
  tasks: { label: string; completed: boolean; onClick: () => void }[];
}) {
  const router = useRouter();
  return (
    <Pane.Root>
      <Pane.Header.Root>
        <Pane.Header.Left />
      </Pane.Header.Root>

      <Pane.Content className="flex flex-col gap-5 p-4">
        <div className="space-y-1">
          <h3 className="text-xl">Complete Your Profile</h3>
          <p className="text-secondary">Level up your profile</p>
        </div>

        <div className="flex flex-col gap-2">
          {tasks.map((item, idx) => {
            return (
              <Card.Root
                key={idx}
                className="hover:text-primary flex items-center gap-2 cursor-pointer"
                onClick={!item.completed ? item.onClick : undefined}
              >
                <Card.Content className="flex w-full justify-between py-3">
                  <div className="flex gap-3 flex-1">
                    <i
                      className={clsx(
                        'size-5',
                        item.completed ? 'icon-check-filled text-accent-400' : 'icon-circle-outline text-tertiary',
                      )}
                    />
                    <p>{item.label}</p>
                  </div>

                  {!item.completed && <i className="icon-chevron-right text-quaternary size-5" />}
                </Card.Content>
              </Card.Root>
            );
          })}
        </div>
      </Pane.Content>
    </Pane.Root>
  );
}
