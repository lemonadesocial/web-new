'use client';

import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Button } from '$lib/components/core';
import { drawer } from '$lib/components/core/dialog';

import { pageConfigAtom, isDirtyAtom } from '../store';
import type { CustomCode, CustomCodeScript, ScriptStrategy } from '../types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

type CodeTab = 'css' | 'head_html' | 'body_html' | 'scripts';

const TABS: { value: CodeTab; label: string; icon: string }[] = [
  { value: 'css', label: 'CSS', icon: 'icon-code' },
  { value: 'head_html', label: 'Head HTML', icon: 'icon-code-brackets' },
  { value: 'body_html', label: 'Body HTML', icon: 'icon-code-brackets' },
  { value: 'scripts', label: 'Scripts', icon: 'icon-terminal' },
];

const SCRIPT_STRATEGIES: { value: ScriptStrategy; label: string; description: string }[] = [
  { value: 'beforeInteractive', label: 'Before Interactive', description: 'Loads before page hydration' },
  { value: 'afterInteractive', label: 'After Interactive', description: 'Loads after page hydration' },
  { value: 'lazyOnload', label: 'Lazy', description: 'Loads during idle time' },
];

const EMPTY_SCRIPT: CustomCodeScript = {
  src: '',
  content: '',
  strategy: 'afterInteractive',
};

// ---------------------------------------------------------------------------
// CodePanel
// ---------------------------------------------------------------------------

/**
 * CodePanel -- Right-drawer panel for editing custom CSS, head HTML,
 * body HTML, and external scripts.
 *
 * All edits update `pageConfigAtom.custom_code` and mark the config as
 * dirty so the auto-save pipeline picks them up.
 */
export function CodePanel() {
  const [pageConfig, setPageConfig] = useAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);
  const [activeTab, setActiveTab] = React.useState<CodeTab>('css');

  const customCode: CustomCode = pageConfig?.custom_code ?? {};

  // Centralized updater — patches `custom_code` inside the config atom
  const updateCustomCode = React.useCallback(
    (patch: Partial<CustomCode>) => {
      setPageConfig((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          custom_code: {
            ...prev.custom_code,
            ...patch,
          },
        };
      });
      setIsDirty(true);
    },
    [setPageConfig, setIsDirty],
  );

  return (
    <div className="flex flex-col h-full">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 flex items-center justify-between px-4 py-2 border-b bg-overlay-secondary backdrop-blur-2xl z-10">
        <span className="text-sm font-medium text-primary">Custom Code</span>
        <Button icon="icon-x" variant="flat" size="xs" onClick={() => drawer.close()} />
      </div>

      {/* --- Tabs --- */}
      <div className="flex border-b px-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            className={clsx(
              'flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition cursor-pointer',
              activeTab === tab.value
                ? 'text-primary border-b-2 border-primary'
                : 'text-tertiary hover:text-secondary',
            )}
            onClick={() => setActiveTab(tab.value)}
          >
            <i className={clsx(tab.icon, 'size-3.5')} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Tab Content --- */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'css' && (
          <CodeTextarea
            label="Custom CSS"
            placeholder={'/* Custom styles */\n.my-section {\n  background: #111;\n}'}
            value={customCode.css ?? ''}
            onChange={(v) => updateCustomCode({ css: v })}
            language="css"
          />
        )}
        {activeTab === 'head_html' && (
          <CodeTextarea
            label="Head HTML"
            placeholder={'<!-- Injected into <head> -->\n<meta name="custom" content="value" />'}
            value={customCode.head_html ?? ''}
            onChange={(v) => updateCustomCode({ head_html: v })}
            language="html"
          />
        )}
        {activeTab === 'body_html' && (
          <CodeTextarea
            label="Body HTML"
            placeholder={'<!-- Injected before </body> -->\n<div id="custom-widget"></div>'}
            value={customCode.body_html ?? ''}
            onChange={(v) => updateCustomCode({ body_html: v })}
            language="html"
          />
        )}
        {activeTab === 'scripts' && (
          <ScriptsEditor
            scripts={customCode.scripts ?? []}
            onChange={(scripts) => updateCustomCode({ scripts })}
          />
        )}
      </div>

      {/* --- Footer hint --- */}
      <div className="sticky bottom-0 border-t bg-overlay-primary/80 backdrop-blur-sm px-4 py-2">
        <p className="text-[11px] text-tertiary leading-relaxed">
          Custom code is injected at publish time. Changes are auto-saved.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// CodeTextarea — Monospace editor for CSS / HTML snippets
// ---------------------------------------------------------------------------

function CodeTextarea({
  label,
  placeholder,
  value,
  onChange,
  language,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  language: 'css' | 'html';
}) {
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Tab key inserts two spaces instead of moving focus
      if (e.key === 'Tab') {
        e.preventDefault();
        const textarea = e.currentTarget;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        onChange(newValue);
        // Reset cursor position after React re-render
        requestAnimationFrame(() => {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = start + 2;
        });
      }
    },
    [value, onChange],
  );

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-secondary">{label}</label>
      <div className="relative">
        <textarea
          className={twMerge(
            'w-full min-h-[280px] rounded-sm border border-card-border',
            'bg-primary/4 p-3 text-sm font-mono text-primary',
            'placeholder:text-tertiary/50 resize-y',
            'focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/30',
          )}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          data-language={language}
        />
        <span className="absolute top-2 right-2 text-[10px] font-mono text-tertiary/40 uppercase pointer-events-none">
          {language}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScriptsEditor — List of external script entries
// ---------------------------------------------------------------------------

function ScriptsEditor({
  scripts,
  onChange,
}: {
  scripts: CustomCodeScript[];
  onChange: (scripts: CustomCodeScript[]) => void;
}) {
  const handleAdd = () => {
    onChange([...scripts, { ...EMPTY_SCRIPT }]);
  };

  const handleRemove = (index: number) => {
    onChange(scripts.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, patch: Partial<CustomCodeScript>) => {
    onChange(scripts.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-secondary">External Scripts</label>
        <Button variant="tertiary-alt" size="xs" onClick={handleAdd}>
          <i className="icon-plus size-3.5" />
          Add Script
        </Button>
      </div>

      {scripts.length === 0 ? (
        <div className="rounded-sm border border-dashed border-card-border p-6 flex flex-col items-center gap-2">
          <i className="icon-terminal size-6 text-tertiary" />
          <p className="text-xs text-tertiary text-center">
            No external scripts added yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {scripts.map((script, index) => (
            <ScriptEntry
              key={index}
              script={script}
              index={index}
              onUpdate={(patch) => handleUpdate(index, patch)}
              onRemove={() => handleRemove(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// ScriptEntry — Single script row
// ---------------------------------------------------------------------------

function ScriptEntry({
  script,
  index,
  onUpdate,
  onRemove,
}: {
  script: CustomCodeScript;
  index: number;
  onUpdate: (patch: Partial<CustomCodeScript>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-sm border border-card-border bg-primary/4 p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-secondary">Script {index + 1}</span>
        <Button icon="icon-trash" variant="flat" size="xs" onClick={onRemove} />
      </div>

      {/* Source URL */}
      <div className="space-y-1">
        <label className="text-[11px] text-tertiary">Source URL</label>
        <input
          className={twMerge(
            'w-full rounded-sm border border-card-border bg-overlay-primary',
            'px-2.5 py-1.5 text-sm font-mono text-primary',
            'placeholder:text-tertiary/50',
            'focus:outline-none focus:ring-1 focus:ring-primary/30',
          )}
          placeholder="https://cdn.example.com/script.js"
          value={script.src ?? ''}
          onChange={(e) => onUpdate({ src: e.target.value })}
        />
      </div>

      {/* Inline Content */}
      <div className="space-y-1">
        <label className="text-[11px] text-tertiary">Inline Content</label>
        <textarea
          className={twMerge(
            'w-full min-h-[80px] rounded-sm border border-card-border bg-overlay-primary',
            'px-2.5 py-1.5 text-sm font-mono text-primary resize-y',
            'placeholder:text-tertiary/50',
            'focus:outline-none focus:ring-1 focus:ring-primary/30',
          )}
          placeholder="console.log('hello');"
          value={script.content ?? ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          spellCheck={false}
        />
      </div>

      {/* Load Strategy */}
      <div className="space-y-1.5">
        <label className="text-[11px] text-tertiary">Load Strategy</label>
        <div className="flex gap-1">
          {SCRIPT_STRATEGIES.map((strat) => (
            <button
              key={strat.value}
              className={clsx(
                'flex-1 px-1.5 py-1.5 rounded-sm text-[11px] font-medium transition cursor-pointer text-center',
                script.strategy === strat.value
                  ? 'bg-primary/12 text-primary'
                  : 'text-tertiary hover:bg-primary/4 hover:text-secondary',
              )}
              onClick={() => onUpdate({ strategy: strat.value })}
              title={strat.description}
            >
              {strat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
