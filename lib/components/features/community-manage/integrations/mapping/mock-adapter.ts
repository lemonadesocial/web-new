/**
 * Mock adapter layer for Track B connector mapping.
 * Provides deterministic mock data for UI development — no backend dependency.
 * Replace with real API calls when Track B endpoints are available.
 */

import type {
  ConflictPolicy,
  ConnectorProvider,
  DryRunResult,
  ExternalField,
  FieldMapping,
  LemonadeField,
  MappingConfig,
  MappingDirection,
} from './types';

// ---------------------------------------------------------------------------
// Lemonade-side fields
// ---------------------------------------------------------------------------

export const EVENT_FIELDS: LemonadeField[] = [
  { key: 'title', label: 'Title', type: 'string', required: true },
  { key: 'start', label: 'Start Date', type: 'date', required: true },
  { key: 'end', label: 'End Date', type: 'date' },
  { key: 'description', label: 'Description', type: 'string' },
  { key: 'location', label: 'Location', type: 'string' },
  { key: 'cost', label: 'Cost', type: 'number' },
  { key: 'currency', label: 'Currency', type: 'string' },
  { key: 'category', label: 'Category', type: 'string' },
  { key: 'virtual', label: 'Is Virtual', type: 'boolean' },
  { key: 'virtual_url', label: 'Virtual URL', type: 'string' },
];

export const SPACE_FIELDS: LemonadeField[] = [
  { key: 'email', label: 'Email', type: 'email', required: true },
  { key: 'display_name', label: 'Display Name', type: 'string', required: true },
  { key: 'first_name', label: 'First Name', type: 'string' },
  { key: 'last_name', label: 'Last Name', type: 'string' },
  { key: 'phone', label: 'Phone', type: 'string' },
  { key: 'company', label: 'Company', type: 'string' },
  { key: 'job_title', label: 'Job Title', type: 'string' },
  { key: 'tags', label: 'Tags', type: 'string' },
  { key: 'subscribed', label: 'Subscribed', type: 'boolean' },
];

// ---------------------------------------------------------------------------
// Mock external fields (simulating a Google Sheet / Airtable)
// ---------------------------------------------------------------------------

export const MOCK_EXTERNAL_EVENT_FIELDS: ExternalField[] = [
  { key: 'Event Name', label: 'Event Name', sampleValue: 'Web3 Summit 2025' },
  { key: 'Date', label: 'Date', sampleValue: '2025-06-15' },
  { key: 'End Date', label: 'End Date', sampleValue: '2025-06-17' },
  { key: 'Venue', label: 'Venue', sampleValue: 'Convention Center' },
  { key: 'Price', label: 'Price', sampleValue: '50.00' },
  { key: 'Description', label: 'Description', sampleValue: 'Annual summit...' },
  { key: 'Type', label: 'Type', sampleValue: 'Conference' },
  { key: 'Online', label: 'Online', sampleValue: 'false' },
];

export const MOCK_EXTERNAL_SPACE_FIELDS: ExternalField[] = [
  { key: 'Email Address', label: 'Email Address', sampleValue: 'jane@example.com' },
  { key: 'Full Name', label: 'Full Name', sampleValue: 'Jane Smith' },
  { key: 'First', label: 'First', sampleValue: 'Jane' },
  { key: 'Last', label: 'Last', sampleValue: 'Smith' },
  { key: 'Phone Number', label: 'Phone Number', sampleValue: '+1-555-0123' },
  { key: 'Organization', label: 'Organization', sampleValue: 'Acme Inc' },
  { key: 'Role', label: 'Role', sampleValue: 'Engineer' },
  { key: 'Newsletter', label: 'Newsletter', sampleValue: 'true' },
];

// ---------------------------------------------------------------------------
// API simulation helpers
// ---------------------------------------------------------------------------

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Get fields for the given scope */
export function getLemonadeFields(scope: 'event' | 'space'): LemonadeField[] {
  return scope === 'event' ? EVENT_FIELDS : SPACE_FIELDS;
}

/** Get mock external fields for the given scope */
export function getExternalFields(scope: 'event' | 'space'): ExternalField[] {
  return scope === 'event' ? MOCK_EXTERNAL_EVENT_FIELDS : MOCK_EXTERNAL_SPACE_FIELDS;
}

/** Create a default empty mapping config */
export function createDefaultMappingConfig(
  scope: 'event' | 'space',
  provider: ConnectorProvider = 'google_sheets',
  direction: MappingDirection = 'import',
): MappingConfig {
  return {
    id: crypto.randomUUID(),
    name: `${scope === 'event' ? 'Event' : 'Member'} ${direction === 'import' ? 'Import' : 'Export'}`,
    provider,
    direction,
    scope,
    fieldMappings: [],
    conflictPolicy: 'skip',
    upsertKeys: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

/** Simulate saving a mapping config */
export async function saveMappingConfig(config: MappingConfig): Promise<MappingConfig> {
  await delay(400);
  return { ...config, updatedAt: new Date().toISOString() };
}

/** Simulate a dry-run against the current mapping config */
export async function runDryRun(config: MappingConfig): Promise<DryRunResult> {
  await delay(800);

  const externalFields = getExternalFields(config.scope);
  const totalRows = 12;
  const rows = Array.from({ length: totalRows }, (_, i) => {
    const fields: Record<string, string> = {};
    for (const mapping of config.fieldMappings) {
      const ext = externalFields.find((f) => f.key === mapping.targetField);
      fields[mapping.sourceField] = ext?.sampleValue ?? '';
    }

    // Simulate some errors/warnings for demo purposes
    if (i === 3) {
      return { rowIndex: i, status: 'error' as const, fields, message: 'Missing required field: title' };
    }
    if (i === 7) {
      return { rowIndex: i, status: 'warning' as const, fields, message: 'Date format ambiguous — parsed as ISO' };
    }
    return { rowIndex: i, status: 'ok' as const, fields };
  });

  return {
    totalRows,
    successCount: rows.filter((r) => r.status === 'ok').length,
    warningCount: rows.filter((r) => r.status === 'warning').length,
    errorCount: rows.filter((r) => r.status === 'error').length,
    rows,
  };
}

/** Add a field mapping to the config */
export function addFieldMapping(
  config: MappingConfig,
  sourceField: string,
  targetField: string,
  transform?: string,
): MappingConfig {
  const mapping: FieldMapping = { id: crypto.randomUUID(), sourceField, targetField, transform };
  return { ...config, fieldMappings: [...config.fieldMappings, mapping] };
}

/** Remove a field mapping by id */
export function removeFieldMapping(config: MappingConfig, mappingId: string): MappingConfig {
  return { ...config, fieldMappings: config.fieldMappings.filter((m) => m.id !== mappingId) };
}

/** Update conflict policy */
export function updateConflictPolicy(config: MappingConfig, policy: ConflictPolicy): MappingConfig {
  return { ...config, conflictPolicy: policy };
}

/** Update upsert keys */
export function updateUpsertKeys(config: MappingConfig, keys: string[]): MappingConfig {
  return { ...config, upsertKeys: keys };
}
