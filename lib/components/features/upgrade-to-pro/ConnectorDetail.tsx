'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';

import {
  Button,
  Card,
  Skeleton,
  Menu,
  MenuItem,
  modal,
} from '$lib/components/core';
import { Chip } from '$lib/components/core/chip/Chip';
import { CardTable } from '$lib/components/core/table';
import { useQuery } from '$lib/graphql/request';
import {
  SpaceConnectionsDocument,
  ConnectionLogsDocument,
  type ConnectionOutput,
  type ConnectionLog,
} from '$lib/graphql/generated/backend/graphql';

import { CONNECTOR_ICON_MAP } from './utils';
import { ExportGuestsModal } from './ExportGuestsModal';
import { ImportGuestsModal } from './ImportGuestsModal';

const TRIGGER_VARIANTS: Record<string, 'warning' | 'alert' | 'primary' | 'secondary'> = {
  manual: 'alert',
  scheduled: 'warning',
  ai: 'primary',
  webhook: 'secondary',
};

function TriggerTag({ type }: { type: string }) {
  const variant = TRIGGER_VARIANTS[type.toLowerCase()] ?? 'secondary';
  const label = type.charAt(0).toUpperCase() + type.slice(1);
  return (
    <Chip size="xxs" variant={variant} className="rounded-full px-1.5 py-px">
      {label}
    </Chip>
  );
}

type ConnectorDetailProps = {
  spaceId: string;
  connectionId: string;
};

export function ConnectorDetail({ spaceId, connectionId }: ConnectorDetailProps) {
  const params = useParams<{ domain?: string; uid: string; id: string }>();
  const domain = params.domain ? `/${params.domain}` : '';
  const connectorsHref = `${domain}/s/manage/${params.uid}/settings/connectors`;

  const [logOffset, setLogOffset] = useState(0);
  const LOG_PAGE_SIZE = 10;

  const { data, loading, error } = useQuery(SpaceConnectionsDocument, {
    variables: { spaceId },
    skip: !spaceId,
  });

  const { data: logsData, loading: logsLoading } = useQuery(ConnectionLogsDocument, {
    variables: {
      connectionId,
      limit: LOG_PAGE_SIZE,
      offset: logOffset,
    },
    skip: !connectionId,
  });

  const connections = (data?.spaceConnections ?? []) as ConnectionOutput[];
  const connection = connections.find((c) => c.id === connectionId);
  const logs = (logsData?.connectionLogs ?? []) as ConnectionLog[];

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-5 w-48" animate />
        <Card.Root>
          <Card.Content className="flex flex-col gap-6 py-6">
            <div className="flex items-start gap-4">
              <Skeleton className="size-14 rounded-sm" animate />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-8 w-48" animate />
                <Skeleton className="h-4 w-72" animate />
              </div>
            </div>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  if (error || !connection) {
    return (
      <div className="flex flex-col gap-6">
        <Link href={connectorsHref}>
          <Button variant="tertiary" size="sm" iconLeft="icon-chevron-left">
            Back to Connectors
          </Button>
        </Link>
        <Card.Root>
          <Card.Content className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-secondary">Connection not found or you don't have access to it.</p>
            <Link href={connectorsHref}>
              <Button variant="secondary" size="sm" className="mt-4">
                Back to Connectors
              </Button>
            </Link>
          </Card.Content>
        </Card.Root>
      </div>
    );
  }

  const connector = connection.connector;
  const connectorName = connector?.name ?? connection.connectorType ?? 'Connector';
  const logo = connector ? CONNECTOR_ICON_MAP[connector.icon] : null;
  const actionById = new Map(connector?.actions?.map((a) => [a.id, a]) ?? []);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1.5 text-sm">
        <Link
          href={connectorsHref}
          className="flex items-center gap-1 text-tertiary font-medium hover:text-primary transition-colors"
        >
          <i aria-hidden="true" className="icon-connector-line size-4 shrink-0" />
          Connectors
        </Link>
        <i aria-hidden="true" className="icon-chevron-right size-[18px] text-quaternary shrink-0" />
        <span className="text-secondary">{connectorName}</span>
      </nav>

      <div className="flex items-start justify-between gap-4 w-full">
        <div className="size-12 rounded-sm border border-card-border overflow-hidden shrink-0 bg-overlay-primary">
          {logo ? (
            <img src={logo} alt="" className="size-full object-cover" />
          ) : (
            <span className="size-full flex items-center justify-center text-sm font-medium uppercase text-tertiary">
              {connectorName.slice(0, 2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Chip
            size="s"
            variant="secondary"
            leftIcon="icon-check"
            className="rounded-sm px-2.5 py-1.5 gap-1.5"
          >
            Connected
          </Chip>
          <Menu.Root>
            <Menu.Trigger>
              <Button
                icon="icon-more-vert"
                size="sm"
                variant="tertiary-alt"
                className="rounded-sm h-8 p-2"
                aria-label="More options"
              />
            </Menu.Trigger>
            <Menu.Content className="p-1 min-w-[160px]">
              {({ toggle }) => (
                <MenuItem onClick={toggle}>
                  <div className="flex items-center gap-2.5">
                    <i aria-hidden="true" className="icon-delete size-4 text-error" />
                    <p className="text-sm text-error">Disconnect</p>
                  </div>
                </MenuItem>
              )}
            </Menu.Content>
          </Menu.Root>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-primary leading-10">{connectorName}</h1>
        {connector?.description && (
          <p className="text-tertiary text-base leading-6">{connector.description}</p>
        )}
      </div>

      {connection.errorMessage && (
        <div className="rounded-md border border-danger/30 bg-danger/8 px-3 py-2 text-sm text-danger">
          {connection.errorMessage}
        </div>
      )}

      <div className="flex flex-col gap-12">
      {connector?.actions?.length ? (
        <section className="flex flex-col gap-5">
          <p className="text-xl font-medium">Actions</p>
          <div className="rounded-md border border-card-border bg-overlay-primary overflow-hidden">
            <div className="flex flex-col divide-y-(length:--card-border-width) divide-(--color-divider)">
              {connector.actions.map((action) => {
                const hasManualOrAi = action.triggerTypes?.some(
                  (t) => t.toLowerCase() === 'manual' || t.toLowerCase() === 'ai'
                );
                const hasScheduledOrWebhook = action.triggerTypes?.some(
                  (t) => t.toLowerCase() === 'scheduled' || t.toLowerCase() === 'webhook'
                );
                const showRun = hasManualOrAi;
                const showRunsAuto = hasScheduledOrWebhook && !hasManualOrAi;

                const handleRun = () => {
                  if (!connector) return;

                  if (action.id === 'import-guests') {
                    modal.open(ImportGuestsModal, {
                      props: {
                        spaceId,
                        connectionId,
                        actionId: action.id,
                        connector,
                      },
                    });
                    return;
                  }

                  modal.open(ExportGuestsModal, {
                    props: {
                      spaceId,
                      connectionId,
                      actionId: action.id,
                      connector,
                    },
                  });
                };

                return (
                  <div
                    key={action.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium text-primary text-base leading-6">{action.name}</p>
                        {action.triggerTypes?.map((t) => (
                          <TriggerTag key={t} type={t} />
                        ))}
                      </div>
                      {action.description && (
                        <p className="text-tertiary text-sm leading-5 truncate">{action.description}</p>
                      )}
                    </div>
                    <div className="shrink-0">
                      {showRun && connector && (
                        <Button
                          variant="tertiary"
                          size="sm"
                          className="rounded-sm h-8 px-2.5 py-1.5"
                          onClick={handleRun}
                        >
                          Run
                        </Button>
                      )}
                      {showRunsAuto && (
                        <div className="rounded-sm border border-divider h-8 flex items-center justify-center px-2.5 py-1.5 text-sm text-tertiary font-medium">
                          Runs Automatically
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-medium">Activity Log</h2>
        <CardTable.Root loading={logsLoading} data={logs}>
            <CardTable.Header className="grid grid-cols-[144px_1fr_120px_108px_160px_96px] gap-4 px-4 py-2 text-sm text-tertiary font-medium">
              <span>Time</span>
              <span>Action</span>
              <span>Trigger</span>
              <span>Status</span>
              <span>Records</span>
              <span>Duration</span>
            </CardTable.Header>
            <CardTable.Loading rows={5}>
              <Skeleton className="h-4 w-24" animate />
              <Skeleton className="h-4 w-28" animate />
              <Skeleton className="h-4 w-16" animate />
              <Skeleton className="h-5 w-16 rounded-full" animate />
              <Skeleton className="h-4 w-20" animate />
              <Skeleton className="h-4 w-12" animate />
            </CardTable.Loading>
          <CardTable.EmptyState>
            <div className="flex flex-col items-center justify-center py-12 text-tertiary">
              <i aria-hidden="true" className="icon-list-bulleted size-12 text-quaternary mb-2" />
              <p>No activity yet</p>
              <p className="text-sm mt-0.5">Run an action to see logs here.</p>
            </div>
          </CardTable.EmptyState>
          {logs.map((log) => {
            const actionName = actionById.get(log.actionId)?.name ?? log.actionId;
            const recordsText =
              log.recordsProcessed != null
                ? `${log.recordsProcessed} imported`
                : log.recordsFailed != null
                  ? `${log.recordsFailed} failed`
                  : '-';
            const durationText = `${log.duration}s`;

            return (
              <CardTable.Row key={log._id}>
                <div className="grid grid-cols-[144px_1fr_120px_108px_160px_96px] gap-4 px-4 py-3 items-center">
                  <span className="text-base text-tertiary leading-6">
                    {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                  </span>
                  <span className="text-base text-primary leading-6">{actionName}</span>
                  <span className="text-base text-tertiary leading-6 capitalize">{log.triggerType}</span>
                  <div>
                    <Chip
                      size="xs"
                      variant={log.status === 'success' ? 'success' : 'error'}
                      className="rounded-full px-2 py-[3px]"
                    >
                      {log.status === 'success' ? 'Success' : 'Failed'}
                    </Chip>
                  </div>
                  <span className="text-base text-tertiary leading-6">{recordsText}</span>
                  <span className="text-base text-tertiary leading-6">{durationText}</span>
                </div>
              </CardTable.Row>
            );
          })}
          {logs.length >= LOG_PAGE_SIZE && (
            <CardTable.Pagination
              total={logs.length + 1}
              skip={logOffset}
              limit={LOG_PAGE_SIZE}
              onPrev={() => setLogOffset((p) => Math.max(0, p - LOG_PAGE_SIZE))}
              onNext={() => setLogOffset((p) => p + LOG_PAGE_SIZE)}
            />
          )}
        </CardTable.Root>
      </section>
      </div>
    </div>
  );
}
