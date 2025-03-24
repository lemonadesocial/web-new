import clsx from 'clsx';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.PropsWithChildren {
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'link';
  href?: string;
  target?: '_blank';
  style?: React.CSSProperties | Record<string, string>;
}

export function CardRoot({ children, href = '', onClick, as: tag = 'button', className, ...rest }: CardProps) {
  if (tag === 'link' && href)
    return (
      <Link
        href={href}
        {...rest}
        className={twMerge(
          'p-4 rounded-md border border-tertiary/[0.04] bg-tertiary/[0.04] hover:bg-tertiary/[.08]',
          className,
        )}
      >
        {children}
      </Link>
    );

  return (
    <div
      className={twMerge(
        'text-left rounded-md border border-tertiary/[0.04] bg-tertiary/[0.04]',
        clsx((typeof onClick === 'function' || !!href) && 'cursor-pointer hover:bg-tertiary/[.08]'),
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardHeader({ title }: { title: string }) {
  return <div className="py-2.5 px-4 bg-tertiary/4">{title}</div>;
}

function CardContent({ children, className }: { className?: string } & PropsWithChildren) {
  return <div className={twMerge('p-4', className)}>{children}</div>;
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Content: CardContent,
};
