'use client';

import clsx from 'clsx';

import { Card, Select } from '$lib/components/core';

import type { ConflictPolicy } from './types';
import { getLemonadeFields } from './mock-adapter';
import { useMappingActions, useMappingConfig } from './store';

const CONFLICT_POLICIES: { value: ConflictPolicy; label: string; description: string }[] = [
  { value: 'skip', label: 'Skip', description: 'Skip rows that match an existing record' },
  { value: 'overwrite', label: 'Overwrite', description: 'Replace existing records with incoming data' },
  { value: 'merge', label: 'Merge', description: 'Merge new fields into existing records without overwriting' },
];

export function ConflictPolicySelector() {
  const config = useMappingConfig();
  const { setConflictPolicy, setUpsertKeys } = useMappingActions();

  const lemonadeFields = getLemonadeFields(config.scope);
  const upsertField = lemonadeFields.find((f) => f.key === config.upsertKeys[0]);

  const selectedPolicy = CONFLICT_POLICIES.find((p) => p.value === config.conflictPolicy);

  return (
    <Card.Root>
      <Card.Header className="flex items-center gap-2">
        <i aria-hidden="true" className="icon-settings size-5 text-secondary" />
        <h3 className="font-semibold text-sm">Conflict Policy & Upsert Keys</h3>
      </Card.Header>
      <Card.Content className="space-y-4">
        {/* Conflict policy */}
        <div className="space-y-2">
          <label className="text-xs text-tertiary font-medium">When a record already exists:</label>
          <div className="flex gap-2 flex-wrap">
            {CONFLICT_POLICIES.map((policy) => (
              <button
                key={policy.value}
                type="button"
                onClick={() => setConflictPolicy(policy.value)}
                className={clsx(
                  'px-3 py-2 rounded-sm border text-sm font-medium transition-colors',
                  config.conflictPolicy === policy.value
                    ? 'border-primary bg-primary/8 text-primary'
                    : 'border-primary/8 text-tertiary hover:bg-primary/4',
                )}
              >
                {policy.label}
              </button>
            ))}
          </div>
          {selectedPolicy && (
            <p className="text-xs text-quaternary">{selectedPolicy.description}</p>
          )}
        </div>

        {/* Upsert key selector */}
        <div className="space-y-2">
          <label className="text-xs text-tertiary font-medium">
            Upsert key (field used to detect duplicates):
          </label>
          <Select
            value={upsertField?.label ?? ''}
            onChange={(v) => {
              const field = lemonadeFields.find((f) => f.label === v);
              setUpsertKeys(field?.key ? [field.key] : []);
            }}
            options={lemonadeFields.map((f) => f.label)}
            placeholder="Select a key field"
            variant="outlined"
            inputSize="s"
          />
          {config.upsertKeys.length > 0 && (
            <p className="text-xs text-quaternary">
              Rows matching on <span className="font-medium text-secondary">{upsertField?.label ?? config.upsertKeys[0]}</span> will
              be treated as duplicates.
            </p>
          )}
        </div>
      </Card.Content>
    </Card.Root>
  );
}
