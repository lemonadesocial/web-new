'use client';

import React from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import clsx from 'clsx';

import { Button, Badge } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { Dropdown, type Option } from '$lib/components/core/input/dropdown';
import { Pane } from '$lib/components/core/pane/pane';
import { drawer } from '$lib/components/core/dialog';
import { toast } from '$lib/components/core/toast';
import { useMutation } from '$lib/graphql/request/hooks';
import { GeneratePreviewLinkDocument } from '$lib/graphql/generated/backend/graphql';

import { pageConfigAtom, configIdAtom, isDirtyAtom } from '../store';
import type { PreviewLink, PreviewLinkResponse } from '../types';
import { formatRelativeTime } from '../utils';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL ?? '';

const EXPIRATION_OPTIONS: Option[] = [
  { key: 1, value: '1 hour' },
  { key: 6, value: '6 hours' },
  { key: 24, value: '24 hours' },
  { key: 48, value: '48 hours' },
  { key: 168, value: '7 days' },
  { key: 0, value: 'Never' },
];

const DEFAULT_EXPIRATION = EXPIRATION_OPTIONS[2]; // 24 hours

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatExpirationStatus(expiresAt?: string): { label: string; isExpired: boolean } {
  if (!expiresAt) return { label: 'Never expires', isExpired: false };

  const now = Date.now();
  const expiry = new Date(expiresAt).getTime();

  if (expiry < now) return { label: 'Expired', isExpired: true };

  const diffMs = expiry - now;
  const diffHours = Math.floor(diffMs / 3_600_000);

  if (diffHours < 1) {
    const diffMinutes = Math.floor(diffMs / 60_000);
    return { label: `Expires in ${diffMinutes}m`, isExpired: false };
  }
  if (diffHours < 24) return { label: `Expires in ${diffHours}h`, isExpired: false };

  const diffDays = Math.floor(diffHours / 24);
  return { label: `Expires in ${diffDays}d`, isExpired: false };
}

function truncateUrl(url: string, maxLength = 32): string {
  if (url.length <= maxLength) return url;
  return url.slice(0, maxLength - 3) + '...';
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// PreviewSharePanel
// ---------------------------------------------------------------------------

export function PreviewSharePanel() {
  const config = useAtomValue(pageConfigAtom);
  const configId = useAtomValue(configIdAtom);
  const setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);

  const [password, setPassword] = React.useState('');
  const [expiresInHours, setExpiresInHours] = React.useState<number | null>(24);
  const [generatedLink, setGeneratedLink] = React.useState<PreviewLinkResponse | null>(null);

  const previewLinks = config?.preview_links ?? [];

  // -- Generate preview link --
  const [generatePreviewLink, { loading: isGenerating }] = useMutation(GeneratePreviewLinkDocument);

  const handleGenerate = async () => {
    if (!configId) {
      toast.error('No config loaded. Save your page first.');
      return;
    }

    try {
      const { data, error } = await generatePreviewLink({
        variables: {
          config_id: configId,
          options: {
            password: password || undefined,
            expires_in_hours: expiresInHours ?? undefined,
          },
        },
      });

      if (error) throw error;

      const link = data?.generatePreviewLink;
      if (link) {
        setGeneratedLink(link);

        // Add to preview_links in page config
        const newLink: PreviewLink = {
          id: link.id,
          token: link.token,
          expires_at: link.expires_at,
          created_by: 'current_user',
          created_at: new Date().toISOString(),
          view_count: 0,
        };

        setPageConfig((prev) =>
          prev
            ? {
                ...prev,
                preview_links: [...(prev.preview_links ?? []), newLink],
              }
            : prev,
        );
        setIsDirty(true);
      }

      toast.success('Preview link generated!');
    } catch {
      toast.error('Failed to generate preview link.');
    }
  };

  // -- Revoke a preview link --

  const handleRevoke = (linkId: string) => {
    // TODO: Wire to GraphQL mutation to revoke on server
    setPageConfig((prev) =>
      prev
        ? {
            ...prev,
            preview_links: (prev.preview_links ?? []).filter((l) => l.id !== linkId),
          }
        : prev,
    );
    setIsDirty(true);
    toast.success('Preview link revoked.');
  };

  // -- Copy handler --

  const handleCopy = async (url: string) => {
    const ok = await copyToClipboard(url);
    if (ok) {
      toast.success('Link copied to clipboard!');
    } else {
      toast.error('Failed to copy link.');
    }
  };

  return (
    <Pane.Root className="rounded-none">
      {/* Header */}
      <Pane.Header.Root>
        <Pane.Header.Left showBackButton={false}>
          <span className="text-sm font-semibold text-primary">Preview & Share</span>
        </Pane.Header.Left>
        <Pane.Header.Right>
          <Button icon="icon-x" variant="flat" size="xs" onClick={() => drawer.close()} />
        </Pane.Header.Right>
      </Pane.Header.Root>

      <Pane.Content className="p-4 space-y-6 overflow-auto">
        {/* ---- Generate Preview Link ---- */}
        <section className="space-y-3">
          <label className="text-xs font-semibold text-secondary uppercase tracking-wide">
            Generate Preview Link
          </label>

          {/* Password */}
          <InputField
            label="Password (optional)"
            type="password"
            placeholder="Leave blank for no password"
            value={password}
            onChangeText={setPassword}
          />

          {/* Expiration */}
          <Dropdown
            label="Expires in"
            placeholder="Select expiration..."
            options={EXPIRATION_OPTIONS}
            value={
              EXPIRATION_OPTIONS.find((o) => o.key === (expiresInHours ?? 0)) ??
              DEFAULT_EXPIRATION
            }
            onSelect={(opt) => setExpiresInHours(opt.key === 0 ? null : (opt.key as number))}
          />

          {/* Generate button */}
          <Button
            variant="primary"
            size="sm"
            className="w-full"
            onClick={handleGenerate}
            loading={isGenerating}
            disabled={isGenerating || !configId}
          >
            Generate Link
          </Button>
        </section>

        {/* ---- Generated Link ---- */}
        {generatedLink && (
          <section className="space-y-2">
            <label className="text-xs font-semibold text-secondary uppercase tracking-wide">
              Generated Link
            </label>
            <GeneratedLinkCard
              link={generatedLink}
              onCopy={() => handleCopy(generatedLink.url)}
            />
          </section>
        )}

        {/* ---- Active Preview Links ---- */}
        {previewLinks.length > 0 && (
          <section className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-secondary uppercase tracking-wide">
                Active Links
              </label>
              <span className="text-xs text-tertiary">{previewLinks.length}</span>
            </div>
            <div className="space-y-2">
              {previewLinks.map((link) => (
                <PreviewLinkCard
                  key={link.id}
                  link={link}
                  configId={configId}
                  onCopy={(url) => handleCopy(url)}
                  onRevoke={() => handleRevoke(link.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* ---- Empty state ---- */}
        {previewLinks.length === 0 && !generatedLink && (
          <div className="rounded-sm border border-dashed border-card-border p-6 flex flex-col items-center gap-2">
            <i className="icon-link size-6 text-tertiary" />
            <p className="text-xs text-tertiary text-center">
              No preview links yet. Generate one to share a preview of your unpublished page.
            </p>
          </div>
        )}
      </Pane.Content>
    </Pane.Root>
  );
}

// ---------------------------------------------------------------------------
// Generated Link Card
// ---------------------------------------------------------------------------

function GeneratedLinkCard({
  link,
  onCopy,
}: {
  link: PreviewLinkResponse;
  onCopy: () => void;
}) {
  return (
    <div className="rounded-sm border border-card-border bg-primary/4 p-3 space-y-2">
      <p className="text-sm text-primary font-mono break-all">{link.url}</p>
      {link.expires_at && (
        <p className="text-xs text-tertiary">
          {formatExpirationStatus(link.expires_at).label}
        </p>
      )}
      <div className="flex gap-2">
        <Button
          variant="tertiary-alt"
          size="xs"
          iconLeft="icon-content-copy"
          onClick={onCopy}
        >
          Copy
        </Button>
        <Button
          variant="tertiary-alt"
          size="xs"
          iconLeft="icon-open-in-new"
          onClick={() => window.open(link.url, '_blank', 'noopener')}
        >
          Open
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Preview Link Card (existing links)
// ---------------------------------------------------------------------------

function PreviewLinkCard({
  link,
  configId,
  onCopy,
  onRevoke,
}: {
  link: PreviewLink;
  configId: string | null;
  onCopy: (url: string) => void;
  onRevoke: () => void;
}) {
  const url = `${HOST_URL}/preview/${configId ?? 'unknown'}/${link.token}`;
  const { label: expirationLabel, isExpired } = formatExpirationStatus(link.expires_at);

  return (
    <div
      className={clsx(
        'rounded-sm border border-card-border p-3 space-y-2',
        isExpired && 'opacity-60',
      )}
    >
      {/* URL */}
      <p className="text-sm text-primary font-mono truncate" title={url}>
        {truncateUrl(url)}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-tertiary">
        <span>Created {formatRelativeTime(link.created_at)}</span>
        <span className="text-primary/12">|</span>
        <span>{link.view_count} {link.view_count === 1 ? 'view' : 'views'}</span>
        <span className="text-primary/12">|</span>
        <Badge
          color={isExpired ? '#ef4444' : '#22c55e'}
          title={expirationLabel}
          className="text-[10px] py-0.5"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="tertiary-alt"
          size="xs"
          iconLeft="icon-content-copy"
          onClick={() => onCopy(url)}
          disabled={isExpired}
        >
          Copy
        </Button>
        <Button
          variant="flat"
          size="xs"
          iconLeft="icon-delete"
          onClick={onRevoke}
          className="text-danger-400 hover:text-danger-300"
        >
          Revoke
        </Button>
      </div>
    </div>
  );
}
