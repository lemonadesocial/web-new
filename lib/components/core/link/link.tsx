import clsx from 'clsx';
import NextLink from 'next/link';
import { twMerge } from 'tailwind-merge';

type Props = {
  href: string;
  iconLeft?: string;
  chrevron?: boolean;
  text: string;
  variant?: 'primary' | 'secondary';
  active?: boolean;
};

export function Link({ href, iconLeft, chrevron, text, variant = 'primary', active }: Props) {
  return (
    <NextLink href={href} className={clsx('link', variant, active && 'active')}>
      {iconLeft && <i aria-hidden="true" className={twMerge('text-tertiary', iconLeft)} />}
      <span>{text}</span>
      {chrevron && <i aria-hidden="true" className="icon-chevron-right text-quaternary!" />}
    </NextLink>
  );
}
