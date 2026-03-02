'use client';

import clsx from 'clsx';

import { Select } from '$lib/components/core';

import type { ExternalField, FieldMapping, LemonadeField } from './types';

interface FieldMappingRowProps {
  mapping: FieldMapping;
  lemonadeFields: LemonadeField[];
  externalFields: ExternalField[];
  onChangeSource: (value: string | undefined) => void;
  onChangeTarget: (value: string | undefined) => void;
  onRemove: () => void;
}

export function FieldMappingRow({
  mapping,
  lemonadeFields,
  externalFields,
  onChangeSource,
  onChangeTarget,
  onRemove,
}: FieldMappingRowProps) {
  const sourceField = lemonadeFields.find((f) => f.key === mapping.sourceField);
  const targetField = externalFields.find((f) => f.key === mapping.targetField);

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1 min-w-0">
        <Select
          value={sourceField?.label ?? mapping.sourceField}
          onChange={(v) => {
            const field = lemonadeFields.find((f) => f.label === v);
            onChangeSource(field?.key);
          }}
          options={lemonadeFields.map((f) => f.label)}
          placeholder="Lemonade field"
          variant="outlined"
          inputSize="s"
        />
      </div>

      <i aria-hidden="true" className="icon-arrow-right size-5 text-quaternary shrink-0" />

      <div className="flex-1 min-w-0">
        <Select
          value={targetField?.label ?? mapping.targetField}
          onChange={(v) => {
            const field = externalFields.find((f) => f.label === v);
            onChangeTarget(field?.key);
          }}
          options={externalFields.map((f) => f.label)}
          placeholder="External field"
          variant="outlined"
          inputSize="s"
        />
      </div>

      {targetField?.sampleValue && (
        <span className="text-xs text-quaternary truncate max-w-24 hidden sm:block" title={targetField.sampleValue}>
          e.g. {targetField.sampleValue}
        </span>
      )}

      <button
        type="button"
        onClick={onRemove}
        className={clsx(
          'shrink-0 p-1 rounded-xs hover:bg-primary/8 text-quaternary hover:text-error transition-colors',
        )}
      >
        <i aria-hidden="true" className="icon-delete size-4" />
      </button>
    </div>
  );
}
