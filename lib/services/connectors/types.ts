/**
 * Connector types aligned with backend PR #1912 GraphQL schema.
 *
 * These manual types serve as the source of truth until codegen runs
 * against the updated backend schema. Once codegen produces the
 * generated types, consumers should migrate to the generated versions.
 *
 * Key alignment note (PR #1962): ConnectionCredential stores credentials
 * in a plain `data` field (not `encryptedData`). This field is never
 * exposed via GraphQL — it only matters for backend internals.
 */

// ─── Enums ──────────────────────────────────────────────────

export type ConnectionStatus = 'pending' | 'connected' | 'active' | 'error' | 'expired';

export type SyncStatus = 'success' | 'partial' | 'failed';

export type ConnectorAuthType = 'oauth2' | 'api_key' | 'bot_token';

// ─── Output Types ───────────────────────────────────────────

export interface ConnectorActionInfo {
  id: string;
  name: string;
  description: string;
  triggerTypes: string[];
}

export interface ConnectorDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  authType: string;
  capabilities: string[];
  actions: ConnectorActionInfo[];
}

export interface ConnectionOutput {
  id: string;
  connectorType: string;
  connector?: ConnectorDefinition | null;
  status: ConnectionStatus;
  config?: Record<string, unknown> | null;
  installedBy: string;
  installedAt: string;
  lastSyncAt?: string | null;
  lastSyncStatus?: SyncStatus | null;
  enabled: boolean;
  errorMessage?: string | null;
}

export interface ConnectPlatformResult {
  connectionId: string;
  authUrl?: string | null;
  requiresApiKey: boolean;
}

export interface ConnectorActionResult {
  success: boolean;
  data?: unknown;
  message?: string | null;
  error?: string | null;
  recordsProcessed?: number | null;
  recordsFailed?: number | null;
  externalUrl?: string | null;
}

export interface ConnectorSelectOption {
  value: string;
  label: string;
}

export interface ConnectionLog {
  _id: string;
  connectionId: string;
  spaceId: string;
  actionId: string;
  triggerType: string;
  triggeredBy?: string | null;
  status: string;
  recordsProcessed?: number | null;
  recordsFailed?: number | null;
  duration: number;
  errorMessage?: string | null;
  createdAt: string;
}

// ─── Input Types ────────────────────────────────────────────

export interface ConnectPlatformInput {
  spaceId: string;
  connectorType: string;
}

export interface SubmitApiKeyInput {
  connectionId: string;
  apiKey: string;
}

export interface ConfigureConnectionInput {
  connectionId: string;
  config: Record<string, unknown>;
  syncSchedule?: string | null;
}

export interface ExecuteConnectorActionInput {
  connectionId: string;
  actionId: string;
  params?: Record<string, unknown> | null;
}

// ─── Query Variable Types ───────────────────────────────────

export interface SpaceConnectionsVariables {
  spaceId: string;
}

export interface ConnectionLogsVariables {
  connectionId: string;
  limit?: number | null;
  offset?: number | null;
}

export interface FetchConfigOptionsVariables {
  connectionId: string;
  optionKey: string;
}
