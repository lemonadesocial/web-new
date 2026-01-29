import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export function ListItem({
  icon,
  title,
  placeholder,
  subtile,
  divide = true,
  flexColumn = false,
  children,
}: React.PropsWithChildren & {
  icon: React.ReactNode;
  title: string;
  subtile: string;
  placeholder?: boolean;
  divide?: boolean;
  flexColumn?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="pl-4">
        {
          typeof icon === 'string' ? (
            <i className={twMerge('text-tertiary size-5', icon)} />
          ) : icon
        }
      </div>
      <div className={clsx('flex flex-1 py-3 items-center', divide && 'border-b', flexColumn && 'flex-col items-start gap-1')}>
        <div className="flex-1">
          <p className="text-sm text-tertiary">{title}</p>
          <p className={clsx(placeholder ? 'text-tertiary' : 'text-primary')}>{subtile}</p>
        </div>
        <div className={clsx(flexColumn && 'w-full',  'pr-4')}>{children}</div>
      </div>
    </div>
  );
}
