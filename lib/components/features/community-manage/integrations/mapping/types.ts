/** Track B connector mapping types — aligned with backend contract. */

export type ConnectorProvider = 'google_sheets' | 'airtable' | 'csv';
export type MappingDirection = 'import' | 'export';
export type ConflictPolicy = 'skip' | 'overwrite' | 'merge';

export interface FieldMapping {
  id: string;
  /** Lemonade field key (e.g. "title", "start_date", "email") */
  sourceField: string;
  /** External column/field name in the connector */
  targetField: string;
  /** Optional transform (e.g. "date_iso", "lowercase") */
  transform?: string;
}

export interface MappingConfig {
  id: string;
  name: string;
  provider: ConnectorProvider;
  direction: MappingDirection;
  /** 'event' or 'space' scope */
  scope: 'event' | 'space';
  fieldMappings: FieldMapping[];
  conflictPolicy: ConflictPolicy;
  /** Fields used to detect duplicates (for upsert) */
  upsertKeys: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DryRunRow {
  rowIndex: number;
  status: 'ok' | 'warning' | 'error';
  /** Mapped field values */
  fields: Record<string, string>;
  /** Error/warning message if status !== 'ok' */
  message?: string;
}

export interface DryRunResult {
  totalRows: number;
  successCount: number;
  warningCount: number;
  errorCount: number;
  rows: DryRunRow[];
}

/** Lemonade-side fields available for mapping */
export interface LemonadeField {
  key: string;
  label: string;
  type: 'string' | 'date' | 'number' | 'boolean' | 'email';
  required?: boolean;
}

/** External connector fields (columns, headers, etc.) */
export interface ExternalField {
  key: string;
  label: string;
  sampleValue?: string;
}
