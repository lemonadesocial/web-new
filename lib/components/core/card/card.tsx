import clsx from 'clsx';
import Link from 'next/link';
import React, { JSX } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.PropsWithChildren {
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'link';
  href?: string;
  target?: '_blank';
}

export function Card({ children, href = '', onClick, as: tag = 'button', className, ...rest }: CardProps) {
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

  const Comp =
    typeof onClick === 'function' ? ('button' as keyof JSX.IntrinsicElements) : ('div' as keyof JSX.IntrinsicElements);
  return (
    <Comp
      className={twMerge(
        'p-4 rounded-md border border-tertiary/[0.04] bg-tertiary/[0.04]',
        clsx((typeof onClick === 'function' || !!href) && 'hover:bg-tertiary/[.08]'),
        className,
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}
