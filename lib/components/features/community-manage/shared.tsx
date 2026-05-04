'use client';
import { Button } from '$lib/components/core';

export function CommonSection({
  children,
  title,
  count,
  subtitle,
  actions = [],
}: React.PropsWithChildren & {
  title: string;
  count?: number;
  subtitle: string;
  actions?: Array<
    | {
        iconLeft?: string;
        iconRight?: string;
        onClick?: React.MouseEventHandler<HTMLButtonElement>;
        title?: string;
        icon?: string;
      }
    | undefined
  >;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex gap-2">
            <h3 className="text-xl font-semibold">{title}</h3>
            {count && (
              <div className="size-6 aspect-square rounded-full inline-flex items-center justify-center bg-primary/[0.08] text-tertiary">
                <p className="text-xs">{count}</p>
              </div>
            )}
          </div>

          <p className="text-secondary">{subtitle}</p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          {actions.filter(Boolean).map((item, idx) => (
            <Button
              key={idx}
              iconLeft={item?.iconLeft}
              iconRight={item?.iconRight}
              icon={item?.icon}
              size="sm"
              variant="tertiary-alt"
              onClick={item?.onClick}
            >
              {item?.title}
            </Button>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

export function SmallCommonSection({
  children,
  title,
  count,
  subtitle,
  actions = [],
}: React.PropsWithChildren & {
  title: string;
  count?: number;
  subtitle: string;
  actions?: Array<{
    iconLeft?: string;
    iconRight?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    title: string;
  }>;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex gap-2">
            <p className="text-xl font-semibold">{title}</p>
            {count && (
              <div className="size-6 aspect-square rounded-full inline-flex items-center justify-center bg-primary/[0.08] text-tertiary">
                <p className="text-xs">{count}</p>
              </div>
            )}
          </div>

          <p className="text-secondary">{subtitle}</p>
        </div>
        {!!actions.length && (
          <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
            {actions.map((item, idx) => (
              <Button
                key={idx}
                iconLeft={item.iconLeft}
                iconRight={item.iconRight}
                size="sm"
                variant="tertiary-alt"
                onClick={item.onClick}
              >
                {item.title}
              </Button>
            ))}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
