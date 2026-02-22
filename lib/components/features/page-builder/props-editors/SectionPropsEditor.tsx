'use client';

import React from 'react';
import clsx from 'clsx';

import { InputField } from '$lib/components/core/input/input-field';
import { TextAreaField } from '$lib/components/core/input/textarea';
import { Checkbox } from '$lib/components/core/input/checkbox';
import { Select } from '$lib/components/core/input/select';

import type { SectionType } from '../types';
import { FIELD_REGISTRY, type FieldDef } from './field-registry';

interface SectionPropsEditorProps {
  /** The snake_case section type */
  sectionType: SectionType;
  /** Current prop values from Craft.js node */
  props: Record<string, unknown>;
  /** Callback to update a single prop */
  onUpdateProp: (key: string, value: unknown) => void;
}

/**
 * SectionPropsEditor — renders appropriate form fields for a section type
 * based on the declarative field registry.
 */
export function SectionPropsEditor({
  sectionType,
  props,
  onUpdateProp,
}: SectionPropsEditorProps) {
  const fields = FIELD_REGISTRY[sectionType];

  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-xs text-tertiary">
          No editable properties for this section type.
        </p>
      </div>
    );
  }

  let lastGroup: string | undefined;

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const showGroupHeader = field.group && field.group !== lastGroup;
        if (field.group) lastGroup = field.group;

        return (
          <React.Fragment key={field.key}>
            {showGroupHeader && (
              <div className="pt-2 first:pt-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-tertiary mb-2">
                  {field.group}
                </p>
                <hr className="border-card-border mb-3" />
              </div>
            )}
            <FieldRenderer
              field={field}
              value={props[field.key]}
              onChange={(value) => onUpdateProp(field.key, value)}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ── Field Renderer ──

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  switch (field.type) {
    case 'text':
    case 'url':
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">{field.label}</label>
          <InputField
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChangeText={(text) => onChange(text)}
            type={field.type === 'url' ? 'url' : 'text'}
          />
        </div>
      );

    case 'textarea':
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">{field.label}</label>
          <TextAreaField
            value={(value as string) ?? ''}
            placeholder={field.placeholder}
            onChangeText={(text) => onChange(text)}
            rows={3}
          />
        </div>
      );

    case 'number':
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">{field.label}</label>
          <InputField
            value={String(value ?? '')}
            placeholder={field.placeholder}
            type="number"
            min={field.min}
            max={field.max}
            onChangeText={(text) => {
              const num = Number(text);
              if (!isNaN(num)) onChange(num);
            }}
          />
        </div>
      );

    case 'toggle':
      return (
        <div className="flex items-center justify-between py-1">
          <label className="text-xs font-medium text-secondary">{field.label}</label>
          <Checkbox
            id={`field-${field.key}`}
            value={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
        </div>
      );

    case 'select':
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">{field.label}</label>
          <Select
            value={(value as string) ?? ''}
            options={(field.options ?? []).map((o) => o.value)}
            placeholder={field.placeholder}
            onChange={(v) => onChange(v)}
          />
        </div>
      );

    case 'color':
      return (
        <div className="space-y-1">
          <label className="text-xs font-medium text-secondary">{field.label}</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(value as string) || '#000000'}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 w-8 rounded border border-card-border cursor-pointer bg-transparent"
            />
            <InputField
              value={(value as string) ?? ''}
              placeholder="#000000"
              onChangeText={(text) => onChange(text)}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
}
