'use client';

import React from 'react';
import { useAtomValue } from 'jotai';
import clsx from 'clsx';

import { Button, Badge } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { drawer } from '$lib/components/core/dialog';
import { toast } from '$lib/components/core/toast';
import { useMutation } from '$lib/graphql/request/hooks';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { pageConfigAtom, configIdAtom, ownerTypeAtom } from '../store';
import type { TemplateCategory, TemplateTarget, TemplateVisibility } from '../types';
import { SAVE_CONFIG_AS_TEMPLATE } from '../queries';

type AnyDocument = TypedDocumentNode<any, any>;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'conference',
  'festival',
  'meetup',
  'workshop',
  'concert',
  'networking',
  'community',
  'dao',
  'brand',
  'portfolio',
  'minimal',
  'premium',
  'custom',
];

const TARGET_OPTIONS: { value: TemplateTarget; label: string }[] = [
  { value: 'event', label: 'Event' },
  { value: 'space', label: 'Space' },
  { value: 'universal', label: 'Universal' },
];

const VISIBILITY_OPTIONS: { value: TemplateVisibility; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'unlisted', label: 'Unlisted' },
];

// ---------------------------------------------------------------------------
// Tag Input Sub-component
// ---------------------------------------------------------------------------

function TagInput({
  tags,
  onTagsChange,
}: {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}) {
  const [inputValue, setInputValue] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTags(inputValue);
    }
    if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      onTagsChange(tags.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) {
      addTags(inputValue);
    }
  };

  const addTags = (raw: string) => {
    const newTags = raw
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0 && !tags.includes(t));

    if (newTags.length > 0) {
      onTagsChange([...tags, ...newTags]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      {/* Tag chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xs bg-primary/8 text-xs text-secondary"
            >
              {tag}
              <button
                className="hover:text-primary transition cursor-pointer"
                onClick={() => removeTag(tag)}
                type="button"
              >
                <i className="icon-x size-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <InputField
        placeholder="Add tags (comma-separated)..."
        value={inputValue}
        onChangeText={setInputValue}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Segmented Selector Sub-component
// ---------------------------------------------------------------------------

function SegmentedSelector<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          className={clsx(
            'flex-1 px-2 py-1.5 rounded-sm text-xs font-medium transition cursor-pointer',
            value === option.value
              ? 'bg-primary/12 text-primary'
              : 'text-tertiary hover:bg-primary/4',
          )}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// SaveAsTemplatePanel
// ---------------------------------------------------------------------------

/**
 * SaveAsTemplatePanel - Right-drawer panel for saving the current page config as a template.
 *
 * Features:
 * - Template name (required) and description inputs
 * - Category dropdown
 * - Comma-separated tag input with removable chips
 * - Target selector (Event / Space / Universal)
 * - Visibility selector (Public / Private / Unlisted)
 * - Preview thumbnail URL input
 * - Save button with validation
 */
export function SaveAsTemplatePanel() {
  const config = useAtomValue(pageConfigAtom);
  const configId = useAtomValue(configIdAtom);
  const ownerType = useAtomValue(ownerTypeAtom);

  // --- Form state ---
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [category, setCategory] = React.useState<TemplateCategory>('conference');
  const [tags, setTags] = React.useState<string[]>([]);
  const [target, setTarget] = React.useState<TemplateTarget>(ownerType === 'space' ? 'space' : 'event');
  const [visibility, setVisibility] = React.useState<TemplateVisibility>('public');
  const [thumbnailUrl, setThumbnailUrl] = React.useState(config?.thumbnail_url ?? '');
  // --- Mutation ---
  const [saveAsTemplate, { loading: isSaving }] = useMutation(SAVE_CONFIG_AS_TEMPLATE as AnyDocument);

  // --- Validation ---
  const isValid = name.trim().length > 0;

  // --- Save handler ---
  const handleSave = async () => {
    if (!isValid) {
      toast.error('Template name is required.');
      return;
    }

    if (!configId || !config) {
      toast.error('No page config loaded. Save your page first.');
      return;
    }

    try {
      const { error } = await saveAsTemplate({
        variables: {
          configId,
          input: {
            name: name.trim(),
            description: description.trim(),
            category,
            tags,
            target,
            visibility,
            thumbnail_url: thumbnailUrl || undefined,
            preview_urls: [],
          },
        },
      });

      if (error) throw error;

      toast.success(`Template "${name.trim()}" saved successfully`);
      drawer.close();
    } catch {
      toast.error('Failed to save template. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 flex items-center justify-between px-4 py-2 border-b bg-overlay-secondary backdrop-blur-2xl z-10">
        <span className="text-sm font-medium text-primary">Save as Template</span>
        <Button icon="icon-x" variant="flat" size="xs" onClick={() => drawer.close()} />
      </div>

      {/* --- Form Content --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Template Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">
            Template Name <span className="text-danger-400">*</span>
          </label>
          <InputField
            placeholder="e.g., Modern Conference"
            value={name}
            onChangeText={setName}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Description</label>
          <textarea
            className="w-full min-h-[72px] px-3 py-2 rounded-sm border border-card-border bg-primary/4 text-sm text-primary placeholder:text-tertiary resize-y focus:outline-none focus:border-primary/40 transition"
            placeholder="Describe what this template is best used for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Category</label>
          <select
            className="w-full px-3 py-2 rounded-sm border border-card-border bg-primary/4 text-sm text-primary focus:outline-none focus:border-primary/40 transition appearance-none cursor-pointer"
            value={category}
            onChange={(e) => setCategory(e.target.value as TemplateCategory)}
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Tags */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Tags</label>
          <TagInput tags={tags} onTagsChange={setTags} />
          <p className="text-xs text-tertiary">Press Enter or comma to add a tag</p>
        </div>

        {/* Target */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Target</label>
          <SegmentedSelector
            options={TARGET_OPTIONS}
            value={target}
            onChange={setTarget}
          />
          <p className="text-xs text-tertiary">
            What type of page can this template be used for?
          </p>
        </div>

        {/* Visibility */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Visibility</label>
          <SegmentedSelector
            options={VISIBILITY_OPTIONS}
            value={visibility}
            onChange={setVisibility}
          />
        </div>

        {/* Thumbnail URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-secondary">Preview Thumbnail</label>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <InputField
                placeholder="https://example.com/thumbnail.jpg"
                value={thumbnailUrl}
                onChangeText={setThumbnailUrl}
                iconLeft="icon-image"
              />
            </div>
            {thumbnailUrl && (
              <div className="w-16 h-10 rounded-xs overflow-hidden bg-primary/4 shrink-0">
                <img
                  src={thumbnailUrl}
                  alt="Thumbnail preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
          <p className="text-xs text-tertiary">
            Leave blank to auto-generate from the current page design.
          </p>
        </div>

        {/* --- Separator --- */}
        <div className="border-t border-card-border" />

        {/* --- Config Summary --- */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wide">
            Config Summary
          </label>
          <div className="rounded-sm border border-card-border bg-primary/4 p-3 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-tertiary">Sections</span>
              <span className="text-primary font-medium">{config?.sections?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-tertiary">Theme</span>
              <span className="text-primary font-medium capitalize">{config?.theme?.type ?? 'minimal'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-tertiary">Owner Type</span>
              <span className="text-primary font-medium capitalize">{ownerType}</span>
            </div>
            {config?.custom_code?.css && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-tertiary">Custom CSS</span>
                <Badge color="#8b5cf6" className="text-[10px] py-0.5">
                  Included
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Sticky Footer --- */}
      <div className="sticky bottom-0 px-4 py-3 border-t border-card-border bg-overlay-secondary backdrop-blur-2xl">
        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={handleSave}
          loading={isSaving}
          disabled={!isValid || isSaving}
        >
          Save as Template
        </Button>
      </div>
    </div>
  );
}
