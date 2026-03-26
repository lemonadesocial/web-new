'use client';

import React, { useState } from 'react';

import { Button, InputField, Dropdown, modal, toast } from '$lib/components/core';
import type { Option } from '$lib/components/core/input/dropdown';
import { useQuery, useMutation } from '$lib/graphql/request';
import {
  GetSpaceEventsDocument,
  ExecuteConnectorActionDocument,
  type ConnectorDefinition,
} from '$lib/graphql/generated/backend/graphql';
import { getErrorMessage } from '$lib/utils/error';

import { CONNECTOR_ICONS } from './utils';

type ImportGuestsModalProps = {
  spaceId: string;
  connectionId: string;
  actionId: string;
  connector: ConnectorDefinition;
};

export function ImportGuestsModal({
  spaceId,
  connectionId,
  actionId,
  connector,
}: ImportGuestsModalProps) {
  const connectorName = connector.name;
  const connectorIcon = connector.icon;
  const isAirtable = connector.id === 'airtable';
  const isGoogleSheets = connector.id === 'google-sheets';
  const [selectedEvent, setSelectedEvent] = useState<Option | undefined>();
  const [baseId, setBaseId] = useState('');
  const [tableId, setTableId] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [sheetId, setSheetId] = useState('');

  const { data: eventsData } = useQuery(GetSpaceEventsDocument, {
    variables: { space: spaceId, limit: 100 },
    skip: !spaceId,
  });

  const events = eventsData?.getEvents ?? [];
  const eventOptions: Option[] = events.map((e) => ({
    key: e._id ?? e.shortid,
    value: e.title ?? e.shortid ?? 'Untitled Event',
  }));

  const [executeAction, { loading }] = useMutation(ExecuteConnectorActionDocument, {
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Import failed. Please try again.'));
    },
    onComplete: () => {
      toast.success('Import started successfully.');
      modal.close();
    },
  });

  const canImport = Boolean(
    selectedEvent &&
      (!isAirtable || (baseId.trim() && tableId.trim())) &&
      (!isGoogleSheets || (spreadsheetId.trim() && sheetId.trim()))
  );
  const icon = CONNECTOR_ICONS[connector.id] ?? CONNECTOR_ICONS[connectorIcon];

  const handleImport = () => {
    if (!canImport || !selectedEvent) return;

    const params: Record<string, string> = {
      eventId: String(selectedEvent.key),
    };

    if (isAirtable) {
      params.baseId = baseId.trim();
      params.tableId = tableId.trim();
    }

    if (isGoogleSheets) {
      params.spreadsheetId = spreadsheetId.trim();
      params.sheetId = sheetId.trim();
    }

    executeAction({
      variables: {
        input: {
          connectionId,
          actionId,
          params,
        },
      },
    });
  };

  return (
    <div className="w-100 max-w-full rounded-2xl overflow-hidden border border-card-border bg-overlay-secondary backdrop-blur-xl shadow-lg">
      <div className="flex items-start justify-between p-4">
        <div className="relative size-14 rounded-full bg-primary/8 flex items-center justify-center shrink-0">
          <i aria-hidden="true" className="icon-upload-sharp size-8 text-primary" />
          {icon && (
            <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-xs border-2 border-overlay-secondary overflow-hidden bg-overlay-primary flex items-center justify-center">
              <img src={icon} alt="" className="size-full object-contain" />
            </div>
          )}
        </div>
        <Button
          icon="icon-x"
          size="xs"
          variant="tertiary"
          className="rounded-full size-6 p-0 shrink-0"
          onClick={() => modal.close()}
          aria-label="Close"
        />
      </div>
      <div className="flex flex-col gap-4 px-4 pb-4">
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium text-primary leading-6">Import Guests</p>
          <p className="text-sm text-secondary leading-5">
            Import guests from {connectorName} into one of your events. The integration will read the Email and
            Ticket Type columns from your source.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Dropdown
            label="Destination event"
            placeholder="Select an event"
            value={selectedEvent}
            options={eventOptions}
            onSelect={setSelectedEvent}
          />
        </div>
        {isAirtable && (
          <>
            <div className="flex flex-col gap-1.5">
              <InputField
                label="Base ID"
                placeholder="appXXXXXXXXXXXXXX"
                value={baseId}
                onChangeText={setBaseId}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <InputField
                label="Table ID"
                placeholder="tblXXXXXXXXXXXXXX"
                value={tableId}
                onChangeText={setTableId}
              />
            </div>
          </>
        )}
        {isGoogleSheets && (
          <>
            <div className="flex flex-col gap-1.5">
              <InputField
                label="Spreadsheet ID"
                placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                value={spreadsheetId}
                onChangeText={setSpreadsheetId}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <InputField
                label="Sheet ID"
                placeholder="0"
                value={sheetId}
                onChangeText={setSheetId}
              />
            </div>
          </>
        )}
        <Button
          variant="secondary"
          className="w-full h-10"
          disabled={!canImport}
          loading={loading}
          onClick={handleImport}
        >
          Import
        </Button>
      </div>
    </div>
  );
}
