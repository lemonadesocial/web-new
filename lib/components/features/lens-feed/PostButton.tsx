import clsx from "clsx";
import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type PostButtonProps = {
  icon: string;
  label?: ReactNode;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  iconClassName?: string;
  isActive?: boolean;
};

export function PostButton({ 
  icon, 
  label, 
  onClick, 
  className,
  isActive
}: PostButtonProps) {
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 cursor-pointer hover:bg-primary/16 group',
        className
      )}
      onClick={onClick}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <i className={clsx(
          icon,
          'size-5 transition-all duration-200 group-hover:size-6 group-hover:text-primary',
          isActive ? 'text-primary' : 'text-tertiary'
        )} />
      </div>
      {!!label && <span className={twMerge('text-tertiary font-medium', isActive && 'text-primary')}>{label}</span>}
    </div>
  );
}
