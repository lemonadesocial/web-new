import { twMerge } from 'tailwind-merge';

interface Props {
  icon: string;
  title: string;
  subtitle: string;
}
export function TopEmptyComp({ icon, title, subtitle }: Props) {
  return (
    <div className="max-sm:py-14 p-4 h-full flex text-center flex-col items-center bg-center justify-center gap-4">
      <div className="bg-(--btn-tertiary) flex items-center justify-center size-[42px] aspect-square rounded-sm">
        <i aria-hidden="true" className={twMerge('text-quaternary size-7', icon)} />
      </div>
      <div className="text-tertiary space-y-0.5">
        <p>{title}</p>
        <p className="text-sm">{subtitle}</p>
      </div>
    </div>
  );
}
