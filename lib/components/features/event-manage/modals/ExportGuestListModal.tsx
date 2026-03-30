'use client';

import React from 'react';

import { Button, InputField, modal, toast } from '$lib/components/core';
import { ConfirmTransaction } from '$lib/components/features/modals/ConfirmTransaction';
import {
  type File,
  ExecuteConnectorActionDocument,
  GetEventGuestsStatisticsDocument,
  type ConnectorActionResultFragmentFragment,
  type Event,
} from '$lib/graphql/generated/backend/graphql';
import { useMutation, useQuery } from '$lib/graphql/request';
import { getErrorMessage } from '$lib/utils/error';
import { generateUrl } from '$lib/utils/cnd';
import {
  CONNECTOR_ICONS,
  type ConnectorModalAction,
  type ConnectorModalConnection,
} from '$lib/components/features/upgrade-to-pro/utils';
import { randomEventDP } from '$lib/utils/user';

export type GuestExportConnection = {
  action: ConnectorModalAction;
  connection: ConnectorModalConnection;
};

type ExportGuestListModalProps = {
  connections: GuestExportConnection[];
  event: Event;
};

function getExportDestinationName(eventLabel: string) {
  return `${eventLabel}: Guest List`;
}

function formatGuestCount(count?: number | null) {
  if (typeof count !== 'number' || Number.isNaN(count)) return 'Your guests';
  return `${count.toLocaleString('en-US')} guests`;
}

function getEventGuestCount(stats?: {
  declined: number;
  going: number;
  pending_approval: number;
  pending_invite: number;
} | null) {
  if (!stats) return null;
  return stats.going + stats.pending_approval + stats.pending_invite + stats.declined;
}

function EventPreviewCard({ event }: { event: Event }) {
  const { data } = useQuery(GetEventGuestsStatisticsDocument, {
    variables: {
      event: event._id,
    },
    skip: !event._id,
  });

  const guestCount = getEventGuestCount(data?.getEventGuestsStatistics ?? null);
  const eventCoverFile = event.new_new_photos_expanded?.[0];
  const eventImage = eventCoverFile
    ? generateUrl(eventCoverFile as File) || randomEventDP()
    : randomEventDP();

  return (
    <div className="flex items-center gap-3 rounded-sm bg-white/[0.08] px-3 py-2.5">
      <div className="size-8 shrink-0 overflow-hidden rounded-xs border border-card-border bg-overlay-primary">
        <img src={eventImage} alt="" className="size-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-medium text-primary leading-6">
          {event.title || event.shortid || 'Untitled Event'}
        </p>
        <p className="text-sm text-tertiary leading-5">
          {guestCount == null ? 'Loading guests...' : `${guestCount.toLocaleString('en-US')} guests`}
        </p>
      </div>
    </div>
  );
}

function ConnectorCard({
  connector,
  onClick,
  testId,
}: {
  connector: ConnectorModalConnection['connector'];
  onClick: () => void;
  testId: string;
}) {
  const icon = CONNECTOR_ICONS[connector.id] ?? CONNECTOR_ICONS[connector.icon];

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className="flex w-full flex-col items-start gap-3 rounded-md border border-divider bg-card px-4 py-3.5 text-left transition hover:border-card-border hover:bg-overlay-primary"
    >
      <div className="flex size-8 items-center justify-center overflow-hidden">
        {icon ? (
          <img src={icon} alt="" className="size-full object-contain" />
        ) : (
          <span className="text-sm font-medium uppercase text-secondary">{connector.name.slice(0, 2)}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-base font-medium text-primary leading-6">{connector.name}</p>
      </div>
    </button>
  );
}

export function ExportGuestListModal({ connections, event }: ExportGuestListModalProps) {
  const [step, setStep] = React.useState<'choose' | 'configure' | 'loading' | 'success'>('choose');
  const [selectedConnection, setSelectedConnection] = React.useState<GuestExportConnection | null>(null);
  const [baseId, setBaseId] = React.useState('');
  const [tableId, setTableId] = React.useState('');
  const [spreadsheetId, setSpreadsheetId] = React.useState('');
  const [sheetId, setSheetId] = React.useState('');
  const [successState, setSuccessState] = React.useState<{
    count?: number | null;
    destinationLabel: string;
    destinationName: string;
    externalUrl?: string | null;
  } | null>(null);

  const connector = selectedConnection?.connection.connector ?? null;
  const isAirtable = connector?.id === 'airtable';
  const isGoogleSheets = connector?.id === 'google-sheets';

  const resetForm = () => {
    setBaseId('');
    setTableId('');
    setSpreadsheetId('');
    setSheetId('');
  };

  const handleSelectConnection = (connection: GuestExportConnection) => {
    resetForm();
    setSuccessState(null);
    setSelectedConnection(connection);
    setStep('configure');
  };

  const handleBack = () => {
    resetForm();
    setSelectedConnection(null);
    setStep('choose');
  };

  const [executeAction, { loading }] = useMutation(ExecuteConnectorActionDocument, {
    onError: (error) => {
      setStep('configure');
      toast.error(getErrorMessage(error, 'Export failed. Please try again.'));
    },
    onComplete: (_client, result) => {
      if (!connector) return;

      const connectorResult = result?.executeConnectorAction as
        | ConnectorActionResultFragmentFragment
        | null
        | undefined;

      setSuccessState({
        count: connectorResult?.recordsProcessed ?? null,
        destinationLabel: connector.name,
        destinationName: getExportDestinationName(event.title || event.shortid || 'Guest List'),
        externalUrl: connectorResult?.externalUrl ?? null,
      });
      setStep('success');
    },
  });

  const canExport = Boolean(
    selectedConnection &&
      (!isAirtable || baseId.trim()) &&
      (!isGoogleSheets || spreadsheetId.trim())
  );

  const handleExport = () => {
    if (!selectedConnection || !connector || !canExport) return;

    const params: Record<string, string> = {
      eventId: String(event._id),
    };

    if (isAirtable) {
      params.baseId = baseId.trim();
      if (tableId.trim()) {
        params.tableId = tableId.trim();
      }
    }

    if (isGoogleSheets) {
      params.spreadsheetId = spreadsheetId.trim();
      if (sheetId.trim()) {
        params.sheetId = sheetId.trim();
      }
    }

    setStep('loading');

    executeAction({
      variables: {
        input: {
          actionId: selectedConnection.action.id,
          connectionId: selectedConnection.connection.id,
          params,
        },
      },
    });
  };

  if (step === 'loading' && connector) {
    return (
      <ConfirmTransaction
        title="Exporting Guests..."
        description={`Fetching your guest list and writing to ${connector.name}. This should only take a moment.`}
      />
    );
  }

  if (step === 'success' && successState) {
    return (
      <div className="w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-card-border bg-overlay-secondary shadow-lg backdrop-blur-xl">
        <div className="flex flex-col gap-4 px-4 pb-4 pt-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-success-500/16">
            <i aria-hidden="true" className="icon-done size-8 text-success-500" />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-lg font-medium text-primary leading-6">You&apos;re all set!</p>
            <p className="text-sm text-secondary leading-5">
              {formatGuestCount(successState.count)} have been exported to &lsquo;{successState.destinationName}
              &rsquo; in {successState.destinationLabel}.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {successState.externalUrl && (
              <Button
                variant="secondary"
                className="h-10 w-full justify-center"
                iconRight="icon-arrow-outward"
                onClick={() => {
                  window.open(successState.externalUrl!, '_blank', 'noopener,noreferrer');
                }}
              >
                View in {successState.destinationLabel}
              </Button>
            )}
            <Button
              variant="tertiary"
              className="h-10 w-full justify-center"
              onClick={() => modal.close()}
            >
              Done
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'configure' && connector) {
    return (
      <div
        className="w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-card-border bg-overlay-secondary shadow-lg backdrop-blur-xl"
        data-testid="guest-list-export-detail-modal"
      >
        <div className="flex items-center gap-4 p-4">
          <Button
            icon="icon-chevron-left"
            size="xs"
            variant="tertiary"
            className="size-6 shrink-0 rounded-full p-0"
            onClick={handleBack}
            aria-label="Go back"
          />
          <p className="min-w-0 flex-1 text-center text-base font-medium text-primary leading-6">
            Export to {connector.name}
          </p>
          <Button
            icon="icon-x"
            size="xs"
            variant="tertiary"
            className="size-6 shrink-0 rounded-full p-0"
            onClick={() => modal.close()}
            aria-label="Close"
          />
        </div>

        <div className="flex flex-col gap-4 px-4 pb-4">
          <p className="text-sm text-secondary leading-6">
            {isAirtable
              ? 'Your guest list will be exported to Airtable using the destination details below.'
              : isGoogleSheets
                ? 'Your guest list will be exported to Google Sheets using the destination details below.'
                : `Your guest list will be exported to ${connector.name}.`}
          </p>

          <EventPreviewCard event={event} />

          {isAirtable && (
            <>
              <InputField
                label="Base ID"
                placeholder="appXXXXXXXXXXXXXX"
                value={baseId}
                onChangeText={setBaseId}
              />
              <InputField
                label="Table ID (optional)"
                placeholder="tblXXXXXXXXXXXXXX"
                value={tableId}
                onChangeText={setTableId}
              />
            </>
          )}

          {isGoogleSheets && (
            <>
              <InputField
                label="Spreadsheet ID"
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                value={spreadsheetId}
                onChangeText={setSpreadsheetId}
              />
              <InputField
                label="Sheet ID (optional)"
                placeholder="0"
                value={sheetId}
                onChangeText={setSheetId}
              />
            </>
          )}

          <Button
            variant="secondary"
            className="h-10 w-full"
            disabled={!canExport}
            loading={loading}
            onClick={handleExport}
          >
            Export
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-card-border bg-overlay-secondary shadow-lg backdrop-blur-xl"
      data-testid="guest-list-export-modal"
    >
      <div className="flex items-start justify-between p-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-white/[0.08]">
          <i aria-hidden="true" className="icon-upload-sharp size-8 text-primary" />
        </div>
        <Button
          icon="icon-x"
          size="xs"
          variant="tertiary"
          className="size-6 shrink-0 rounded-full p-0"
          onClick={() => modal.close()}
          aria-label="Close"
        />
      </div>

      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium text-primary leading-6">Export Guest List</p>
          <p className="text-sm text-secondary leading-5">
            Choose where you&apos;d like to sync your guest list. Connect an app to get started.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {connections.map((connection) => (
            <ConnectorCard
              key={connection.connection.id}
              connector={connection.connection.connector}
              testId={`guest-list-export-connector-${connection.connection.connector.id}`}
              onClick={() => handleSelectConnection(connection)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
