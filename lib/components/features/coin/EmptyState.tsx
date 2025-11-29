import { twMerge } from 'tailwind-merge';

interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
}

export function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <div className="flex flex-col justify-center items-center aspect-video py-12 gap-5">
      {icon && <i className={twMerge('size-[120px] md:size-[184px] aspect-square text-quaternary', icon)} />}
      <div className="space-y-2 text-center">
        <h3 className="text-xl text-tertiary font-semibold">{title}</h3>
        {subtitle && <p className="text-tertiary max-sm:text-xs max-sm:w-xs md:w-[480px]">{subtitle}</p>}
      </div>
    </div>
  );
}
