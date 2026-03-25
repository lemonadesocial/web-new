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

import { CONNECTOR_ICON_MAP } from './utils';

type ExportGuestsModalProps = {
  spaceId: string;
  connectionId: string;
  actionId: string;
  connector: ConnectorDefinition;
};

export function ExportGuestsModal({
  spaceId,
  connectionId,
  actionId,
  connector,
}: ExportGuestsModalProps) {
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
      toast.error(getErrorMessage(error, 'Export failed. Please try again.'));
    },
    onComplete: (_client, data) => {
      toast.success('Export completed successfully.');
      modal.close();
    },
  });

  const canExport = Boolean(
    selectedEvent &&
      (!isAirtable || baseId.trim()) &&
      (!isGoogleSheets || spreadsheetId.trim())
  );
  const logo = connectorIcon ? CONNECTOR_ICON_MAP[connectorIcon] : CONNECTOR_ICON_MAP['google-sheets'];

  const handleExport = () => {
    if (!canExport || !selectedEvent) return;

    const params: Record<string, string> = {
      eventId: String(selectedEvent.key),
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
          {logo && (
            <div className="absolute -bottom-0.5 -right-0.5 size-4 rounded-xs border-2 border-overlay-secondary overflow-hidden bg-overlay-primary">
              <img src={logo} alt="" className="size-full object-contain" />
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
          <p className="text-lg font-medium text-primary leading-6">Export Guests</p>
          <p className="text-sm text-secondary leading-5">
            Export your guest list for a selected event to {connectorName}. New rows will be appended
            to the destination you choose.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Dropdown
            label="Event"
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
                label="Table ID (optional)"
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
                label="Sheet ID (optional)"
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
