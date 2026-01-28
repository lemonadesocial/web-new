import { Address, File } from '$lib/graphql/generated/backend/graphql';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';
import React from 'react';

export const PUBLIC_OPTIONS = [
  {
    title: 'Public',
    subtitle: 'Shown on your community & eligible to be featured',
    icon: 'icon-globe',
    private: false,
  },
  {
    title: 'Private',
    subtitle: 'Unlisted. Only people with the link can register.',
    icon: 'icon-sparkles',
    private: true,
  },
];

export type EventFormValue = {
  title: string;
  description: string;
  private: boolean;
  cost: number;
  currency: string;
  date: {
    start: string;
    end: string;
    timezone: string;
  };

  address?: {
    address: Address;
    latitude?: number;
    longitude?: number;
  };
  options: {
    approval_required: boolean;
    // NOTE: invite guest limit field
    guest_limit_per: number;
    // NOTE: capacity field
    guest_limit?: number;
  };
  virtual: boolean;
  virtual_url: string;
  cover?: File;
  space?: string;
  listToSpace?: string;
};

export function OptionLineItem({
  icon,
  label,
  divide = true,
  children,
}: React.PropsWithChildren & { icon: string; label: string; divide?: boolean }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <div className="pl-3.5">
        <i className={twMerge('size-5 text-tertiary', icon)} />
      </div>
      <div className={clsx('flex flex-1 items-center py-2.5 pr-3.5', divide && 'border-b')}>
        <p className="flex-1">{label}</p>
        {children}
      </div>
    </div>
  );
}

export function getLocation(address: Address) {
  const location = [];
  if (address.street_1) return address.street_1;
  if (address.city) location.push(address.city);
  if (address.country) location.push(address.country);
  return location.join(', ');
}

export function isValidUrl(url?: string) {
  if (!url) return false;

  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  return pattern.test(url);
}
