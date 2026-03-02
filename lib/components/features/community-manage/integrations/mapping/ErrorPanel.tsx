'use client';

import clsx from 'clsx';

import { Card } from '$lib/components/core';

import { useDryRunResult } from './store';

export function ErrorPanel() {
  const result = useDryRunResult();

  if (!result) return null;

  const failures = result.rows.filter((r) => r.status === 'error' || r.status === 'warning');

  if (failures.length === 0) return null;

  return (
    <Card.Root>
      <Card.Header className="flex items-center gap-2">
        <i aria-hidden="true" className="icon-alert-outline size-5 text-warning-500" />
        <h3 className="font-semibold text-sm">
          Row-Level Issues ({failures.length})
        </h3>
      </Card.Header>
      <Card.Content className="p-0">
        <ul className="divide-y divide-primary/4">
          {failures.map((row) => (
            <li
              key={row.rowIndex}
              className={clsx(
                'flex items-start gap-3 px-4 py-3',
                row.status === 'error' && 'bg-error/4',
                row.status === 'warning' && 'bg-warning-500/4',
              )}
            >
              <i
                aria-hidden="true"
                className={clsx(
                  'size-4 mt-0.5 shrink-0',
                  row.status === 'error' ? 'icon-cancel text-error' : 'icon-alert-outline text-warning-500',
                )}
              />
              <div className="min-w-0">
                <span className="text-sm font-medium text-primary">Row {row.rowIndex + 1}</span>
                <p className="text-xs text-secondary mt-0.5">{row.message}</p>
              </div>
              <span
                className={clsx(
                  'text-xs font-medium px-1.5 py-0.5 rounded-xs shrink-0',
                  row.status === 'error' ? 'text-error bg-error/8' : 'text-warning-500 bg-warning-500/8',
                )}
              >
                {row.status}
              </span>
            </li>
          ))}
        </ul>
      </Card.Content>
    </Card.Root>
  );
}
