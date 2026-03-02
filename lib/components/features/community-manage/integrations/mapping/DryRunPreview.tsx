'use client';

import clsx from 'clsx';

import { Button, Card, Skeleton } from '$lib/components/core';

import { useDryRunLoading, useDryRunResult, useMappingActions, useMappingConfig } from './store';

export function DryRunPreview() {
  const config = useMappingConfig();
  const result = useDryRunResult();
  const loading = useDryRunLoading();
  const { runDryRun } = useMappingActions();

  const hasMapping = config.fieldMappings.length > 0;
  const mappedSourceKeys = config.fieldMappings.map((m) => m.sourceField);

  return (
    <Card.Root>
      <Card.Header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i aria-hidden="true" className="icon-view size-5 text-secondary" />
          <h3 className="font-semibold text-sm">Dry Run Preview</h3>
        </div>
        <Button
          variant="tertiary"
          size="sm"
          onClick={runDryRun}
          disabled={!hasMapping || loading}
          iconLeft="icon-refresh"
        >
          {loading ? 'Running...' : 'Run Preview'}
        </Button>
      </Card.Header>
      <Card.Content className="p-0">
        {!result && !loading && (
          <div className="py-10 text-center">
            <p className="text-sm text-quaternary">
              {hasMapping
                ? 'Click "Run Preview" to see how your data will map.'
                : 'Add field mappings first, then run a preview.'}
            </p>
          </div>
        )}

        {loading && (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        )}

        {result && !loading && (
          <>
            {/* Summary bar */}
            <div className="flex gap-4 px-4 py-3 border-b border-primary/8 text-xs font-medium">
              <span className="text-secondary">
                Total: <span className="text-primary">{result.totalRows}</span>
              </span>
              <span className="text-success">OK: {result.successCount}</span>
              <span className="text-warning-500">Warnings: {result.warningCount}</span>
              <span className="text-error">Errors: {result.errorCount}</span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-primary/8">
                    <th className="text-left text-xs text-tertiary font-medium px-4 py-2 w-10">#</th>
                    <th className="text-left text-xs text-tertiary font-medium px-4 py-2 w-20">Status</th>
                    {mappedSourceKeys.map((key) => (
                      <th key={key} className="text-left text-xs text-tertiary font-medium px-4 py-2">
                        {key}
                      </th>
                    ))}
                    <th className="text-left text-xs text-tertiary font-medium px-4 py-2">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => (
                    <tr
                      key={row.rowIndex}
                      className={clsx(
                        'border-b border-primary/4',
                        row.status === 'error' && 'bg-error/4',
                        row.status === 'warning' && 'bg-warning-500/4',
                      )}
                    >
                      <td className="px-4 py-2 text-quaternary text-xs">{row.rowIndex + 1}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={row.status} />
                      </td>
                      {mappedSourceKeys.map((key) => (
                        <td key={key} className="px-4 py-2 text-secondary truncate max-w-40">
                          {row.fields[key] || '-'}
                        </td>
                      ))}
                      <td className="px-4 py-2 text-xs text-quaternary">{row.message || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card.Content>
    </Card.Root>
  );
}

function StatusBadge({ status }: { status: 'ok' | 'warning' | 'error' }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-xs',
        status === 'ok' && 'text-success bg-success/8',
        status === 'warning' && 'text-warning-500 bg-warning-500/8',
        status === 'error' && 'text-error bg-error/8',
      )}
    >
      <i
        aria-hidden="true"
        className={clsx(
          'size-3',
          status === 'ok' && 'icon-done',
          status === 'warning' && 'icon-alert-outline',
          status === 'error' && 'icon-cancel',
        )}
      />
      {status}
    </span>
  );
}
