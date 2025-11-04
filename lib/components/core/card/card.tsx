import clsx from 'clsx';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.PropsWithChildren {
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
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
          'p-4 rounded-md border-(length:--card-border-width) border-card-border bg-card backdrop-blur-lg hover:bg-card-hover',
          className,
        )}
      >
        {children}
      </Link>
    );

  return (
    <div
      className={twMerge(
        'text-left rounded-md border-(length:--card-border-width) border-card-border bg-card backdrop-blur-lg overflow-hidden',
        clsx((typeof onClick === 'function' || !!href) && 'cursor-pointer hover:bg-card-hover'),
        className,
      )}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className }: { className?: string } & PropsWithChildren) {
  return <div className={twMerge('py-2.5 px-4 bg-card', className)}>{children}</div>;
}

function CardContent({ children, className }: { className?: string } & PropsWithChildren) {
  return <div className={twMerge('p-4', className)}>{children}</div>;
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Content: CardContent,
};
