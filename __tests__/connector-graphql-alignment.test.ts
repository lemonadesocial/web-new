import { expect, it, describe } from 'vitest';

import type {
  ConnectionOutput,
  ConnectorDefinition,
  ConnectPlatformResult,
  ConnectorActionResult,
  ConnectorSelectOption,
  ConnectionLog,
  ConnectPlatformInput,
  SubmitApiKeyInput,
  ConfigureConnectionInput,
  ExecuteConnectorActionInput,
} from '$lib/services/connectors';

/**
 * Validates that connector TypeScript types are aligned with the
 * backend schema defined in PR #1912.
 *
 * The companion connector.gql file defines the 9 GraphQL operations
 * (4 queries + 5 mutations) that map to the BE resolver.
 *
 * Key alignment: ConnectionCredential uses `data` field (PR #1962),
 * NOT `encryptedData`. This field is server-only and never exposed
 * via GraphQL, so no FE references should exist.
 */

// ─── ConnectionOutput fields ────────────────────────────────

describe('ConnectionOutput type fields', () => {
  it('has all required fields from BE schema', () => {
    const output: ConnectionOutput = {
      id: '1',
      connectorType: 'airtable',
      status: 'active',
      installedBy: 'user1',
      installedAt: new Date().toISOString(),
      enabled: true,
    };
    expect(output.id).toBeDefined();
    expect(output.connectorType).toBeDefined();
    expect(output.status).toBeDefined();
    expect(output.installedBy).toBeDefined();
    expect(output.installedAt).toBeDefined();
    expect(output.enabled).toBeDefined();
  });

  it('supports nullable fields', () => {
    const output: ConnectionOutput = {
      id: '1',
      connectorType: 'airtable',
      status: 'active',
      installedBy: 'user1',
      installedAt: new Date().toISOString(),
      enabled: true,
      connector: null,
      config: null,
      lastSyncAt: null,
      lastSyncStatus: null,
      errorMessage: null,
    };
    expect(output.connector).toBeNull();
    expect(output.config).toBeNull();
  });

  it('status accepts all valid ConnectionStatus values', () => {
    const statuses: ConnectionOutput['status'][] = ['pending', 'connected', 'active', 'error', 'expired'];
    statuses.forEach((s) => expect(s).toBeDefined());
  });
});

// ─── ConnectorDefinition fields ─────────────────────────────

describe('ConnectorDefinition type', () => {
  it('has all required fields from BE schema', () => {
    const def: ConnectorDefinition = {
      id: 'airtable',
      name: 'Airtable',
      description: 'Sync with Airtable',
      icon: 'airtable-icon',
      category: 'productivity',
      authType: 'api_key',
      capabilities: ['import', 'export'],
      actions: [{ id: 'sync', name: 'Sync', description: 'Sync data', triggerTypes: ['manual'] }],
    };
    expect(def.id).toBeDefined();
    expect(def.actions).toHaveLength(1);
    expect(def.actions[0].triggerTypes).toContain('manual');
  });
});

// ─── Input types ────────────────────────────────────────────

describe('input types match BE schema', () => {
  it('ConnectPlatformInput has spaceId and connectorType', () => {
    const input: ConnectPlatformInput = { spaceId: 's1', connectorType: 'airtable' };
    expect(input.spaceId).toBe('s1');
    expect(input.connectorType).toBe('airtable');
  });

  it('SubmitApiKeyInput has connectionId and apiKey', () => {
    const input: SubmitApiKeyInput = { connectionId: 'c1', apiKey: 'key123' };
    expect(input.connectionId).toBe('c1');
    expect(input.apiKey).toBe('key123');
  });

  it('ConfigureConnectionInput has connectionId, config, and optional syncSchedule', () => {
    const input: ConfigureConnectionInput = {
      connectionId: 'c1',
      config: { baseId: 'appXYZ' },
      syncSchedule: '0 * * * *',
    };
    expect(input.config).toHaveProperty('baseId');
  });

  it('ExecuteConnectorActionInput has connectionId, actionId, and optional params', () => {
    const input: ExecuteConnectorActionInput = {
      connectionId: 'c1',
      actionId: 'sync_events',
      params: { limit: 100 },
    };
    expect(input.actionId).toBe('sync_events');
  });
});

// ─── ConnectPlatformResult ──────────────────────────────────

describe('ConnectPlatformResult type', () => {
  it('supports OAuth flow (authUrl present)', () => {
    const result: ConnectPlatformResult = {
      connectionId: 'c1',
      authUrl: 'https://airtable.com/oauth2/v1/authorize?client_id=xxx',
      requiresApiKey: false,
    };
    expect(result.authUrl).toBeDefined();
    expect(result.requiresApiKey).toBe(false);
  });

  it('supports API key flow (requiresApiKey true)', () => {
    const result: ConnectPlatformResult = {
      connectionId: 'c1',
      requiresApiKey: true,
    };
    expect(result.requiresApiKey).toBe(true);
    expect(result.authUrl).toBeUndefined();
  });
});

// ─── ConnectionLog ──────────────────────────────────────────

describe('ConnectionLog type', () => {
  it('has all fields from BE schema', () => {
    const log: ConnectionLog = {
      _id: 'log1',
      connectionId: 'c1',
      spaceId: 's1',
      actionId: 'sync_events',
      triggerType: 'manual',
      status: 'success',
      duration: 1500,
      createdAt: new Date().toISOString(),
    };
    expect(log.duration).toBe(1500);
  });
});

// ─── ConnectorActionResult ──────────────────────────────────

describe('ConnectorActionResult type', () => {
  it('supports success with data', () => {
    const result: ConnectorActionResult = {
      success: true,
      data: { events: [{ id: 1 }] },
      recordsProcessed: 10,
      recordsFailed: 0,
    };
    expect(result.success).toBe(true);
    expect(result.recordsProcessed).toBe(10);
  });

  it('supports failure with error', () => {
    const result: ConnectorActionResult = {
      success: false,
      error: 'Token expired',
    };
    expect(result.success).toBe(false);
    expect(result.error).toBe('Token expired');
  });
});

// ─── ConnectorSelectOption ──────────────────────────────────

describe('ConnectorSelectOption type', () => {
  it('has value and label fields', () => {
    const option: ConnectorSelectOption = { value: 'base123', label: 'My Base' };
    expect(option.value).toBe('base123');
    expect(option.label).toBe('My Base');
  });
});
