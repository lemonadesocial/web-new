'use client';

import React from 'react';

import { Button, Card } from '$lib/components/core';

import { FieldMappingRow } from './FieldMappingRow';
import { getExternalFields, getLemonadeFields } from './mock-adapter';
import { useMappingActions, useMappingConfig } from './store';

export function SpaceMappingEditor() {
  const config = useMappingConfig();
  const { addMapping, removeMapping } = useMappingActions();

  const lemonadeFields = getLemonadeFields('space');
  const externalFields = getExternalFields('space');

  const unmappedSource = lemonadeFields.filter(
    (f) => !config.fieldMappings.some((m) => m.sourceField === f.key),
  );
  const unmappedTarget = externalFields.filter(
    (f) => !config.fieldMappings.some((m) => m.targetField === f.key),
  );

  const handleAdd = () => {
    const source = unmappedSource[0]?.key;
    const target = unmappedTarget[0]?.key;
    if (source && target) {
      addMapping(source, target);
    }
  };

  return (
    <Card.Root>
      <Card.Header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i aria-hidden="true" className="icon-people size-5 text-secondary" />
          <h3 className="font-semibold text-sm">Member / Subscriber Field Mapping</h3>
        </div>
        <span className="text-xs text-quaternary">{config.fieldMappings.length} mapped</span>
      </Card.Header>
      <Card.Content>
        {/* Column headers */}
        <div className="flex items-center gap-3 pb-2 border-b border-primary/8 mb-1">
          <span className="flex-1 text-xs text-tertiary font-medium">Lemonade Field</span>
          <span className="w-5" />
          <span className="flex-1 text-xs text-tertiary font-medium">External Column</span>
          <span className="w-6" />
        </div>

        {config.fieldMappings.map((mapping) => (
          <FieldMappingRow
            key={mapping.id}
            mapping={mapping}
            lemonadeFields={lemonadeFields}
            externalFields={externalFields}
            onChangeSource={(v) => {
              if (!v) return;
              removeMapping(mapping.id);
              addMapping(v, mapping.targetField, mapping.transform);
            }}
            onChangeTarget={(v) => {
              if (!v) return;
              removeMapping(mapping.id);
              addMapping(mapping.sourceField, v, mapping.transform);
            }}
            onRemove={() => removeMapping(mapping.id)}
          />
        ))}

        {config.fieldMappings.length === 0 && (
          <p className="text-sm text-quaternary py-6 text-center">
            No field mappings configured. Add one to get started.
          </p>
        )}

        {unmappedSource.length > 0 && unmappedTarget.length > 0 && (
          <div className="pt-3 border-t border-primary/8 mt-2">
            <Button variant="tertiary" size="sm" iconLeft="icon-add-outline" onClick={handleAdd}>
              Add Field Mapping
            </Button>
          </div>
        )}
      </Card.Content>
    </Card.Root>
  );
}
