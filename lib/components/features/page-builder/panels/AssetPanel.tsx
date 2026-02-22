'use client';

import React from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';

import { Button, Skeleton } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { drawer } from '$lib/components/core/dialog';
import { toast } from '$lib/components/core/toast';
import { useQuery, useMutation } from '$lib/graphql/request/hooks';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

import { ownerIdAtom } from '../store';
import type { SpaceAsset, StockPhoto } from '../types';
import { LIST_SPACE_ASSETS, SEARCH_STOCK_PHOTOS, DELETE_SPACE_ASSET } from '../queries';

type AnyDocument = TypedDocumentNode<any, any>;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AssetTab = 'my-assets' | 'stock';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AssetGridSkeleton({ columns }: { columns: number }) {
  return (
    <div className={clsx('grid gap-2', columns === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} animate className="aspect-square w-full rounded-sm" />
      ))}
    </div>
  );
}

function MyAssetCard({
  asset,
  onDelete,
  onSelect,
}: {
  asset: SpaceAsset;
  onDelete: (id: string) => void;
  onSelect: (url: string) => void;
}) {
  return (
    <div
      className="relative aspect-square rounded-sm overflow-hidden bg-primary/4 group cursor-pointer"
      onClick={() => onSelect(asset.url)}
    >
      <img
        src={asset.url}
        alt={asset.description ?? 'Asset'}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
        <button
          className="p-1.5 rounded-xs bg-white/10 hover:bg-white/20 transition cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(asset._id);
          }}
          title="Delete asset"
        >
          <i className="icon-delete size-4 text-white" />
        </button>
        {asset.size != null && (
          <span className="text-[10px] text-white/70">{formatFileSize(asset.size)}</span>
        )}
      </div>
    </div>
  );
}

function StockPhotoCard({
  photo,
  onSelect,
}: {
  photo: StockPhoto;
  onSelect: (photo: StockPhoto) => void;
}) {
  // Derive aspect ratio for masonry effect
  const aspectRatio = photo.width / photo.height;

  return (
    <div
      className="relative rounded-sm overflow-hidden bg-primary/4 group cursor-pointer break-inside-avoid mb-2"
      style={{ aspectRatio: String(aspectRatio) }}
      onClick={() => onSelect(photo)}
    >
      <img
        src={photo.thumbnail_url}
        alt={photo.description ?? 'Stock photo'}
        className="w-full h-full object-cover"
        loading="lazy"
      />

      {/* Attribution overlay on hover */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-white/80 truncate">
          {photo.attribution.photographer} / {photo.attribution.source}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AssetPanel
// ---------------------------------------------------------------------------

/**
 * AssetPanel - Right-drawer panel for managing images and assets.
 *
 * Two tabs:
 * - "My Assets": Grid of uploaded space assets with delete overlay
 * - "Stock Photos": Search-driven grid of stock photos with attribution
 *
 * Features:
 * - Upload button for adding new assets
 * - Delete on hover for owned assets
 * - Click to copy URL / select asset
 * - Masonry-style layout for stock photos
 * - Loading skeletons and empty states
 */
export function AssetPanel() {
  const [activeTab, setActiveTab] = React.useState<AssetTab>('my-assets');
  const [searchQuery, setSearchQuery] = React.useState('');

  const ownerId = useAtomValue(ownerIdAtom);

  // --- Load my assets ---
  const { data: assetsData, loading: isLoading, refetch: refetchAssets } = useQuery(
    LIST_SPACE_ASSETS as AnyDocument,
    { variables: { spaceId: ownerId }, skip: !ownerId },
  );

  const assets: SpaceAsset[] = assetsData?.listSpaceAssets ?? [];

  // --- Load stock photos ---
  const { data: stockData, loading: isSearching } = useQuery(
    SEARCH_STOCK_PHOTOS as AnyDocument,
    { variables: { query: searchQuery, perPage: 30 }, skip: !searchQuery },
  );

  const stockPhotos: StockPhoto[] = stockData?.searchStockPhotos ?? [];

  // --- Handlers ---

  const handleUpload = () => {
    // TODO: Wire up file input + ADD_SPACE_ASSET mutation
    toast.success('Upload feature coming soon');
  };

  const [deleteAsset] = useMutation(DELETE_SPACE_ASSET as AnyDocument);

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const { error } = await deleteAsset({
        variables: { spaceId: ownerId, fileId: assetId },
      });

      if (error) throw error;

      toast.success('Asset deleted');
      refetchAssets();
    } catch {
      toast.error('Failed to delete asset.');
    }
  };

  const handleSelectAsset = (url: string) => {
    try {
      navigator.clipboard.writeText(url);
      toast.success('Image URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  const handleSelectStockPhoto = (photo: StockPhoto) => {
    try {
      navigator.clipboard.writeText(photo.url);
      toast.success('Stock photo URL copied to clipboard');
    } catch {
      toast.error('Failed to copy URL');
    }
  };

  // --- Tab definitions ---

  const tabs: { value: AssetTab; label: string }[] = [
    { value: 'my-assets', label: 'My Assets' },
    { value: 'stock', label: 'Stock Photos' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* --- Sticky Header --- */}
      <div className="sticky top-0 flex items-center justify-between px-4 py-2 border-b bg-overlay-secondary backdrop-blur-2xl z-10">
        <span className="text-sm font-medium text-primary">Assets</span>
        <Button icon="icon-x" variant="flat" size="xs" onClick={() => drawer.close()} />
      </div>

      {/* --- Tab Switcher --- */}
      <div className="flex border-b px-4">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={clsx(
              'px-3 py-2 text-sm font-medium transition cursor-pointer',
              activeTab === tab.value
                ? 'text-primary border-b-2 border-primary'
                : 'text-tertiary hover:text-secondary',
            )}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Tab Content --- */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'my-assets' ? (
          <MyAssetsTab
            assets={assets}
            isLoading={isLoading}
            onUpload={handleUpload}
            onDelete={handleDeleteAsset}
            onSelect={handleSelectAsset}
          />
        ) : (
          <StockPhotosTab
            photos={stockPhotos}
            isLoading={isSearching}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelect={handleSelectStockPhoto}
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// My Assets Tab
// ---------------------------------------------------------------------------

function MyAssetsTab({
  assets,
  isLoading,
  onUpload,
  onDelete,
  onSelect,
}: {
  assets: SpaceAsset[];
  isLoading: boolean;
  onUpload: () => void;
  onDelete: (id: string) => void;
  onSelect: (url: string) => void;
}) {
  return (
    <div className="p-4 space-y-3">
      {/* Upload button */}
      <Button
        variant="tertiary-alt"
        size="sm"
        icon="icon-upload"
        onClick={onUpload}
        className="w-full"
      >
        Upload Image
      </Button>

      {isLoading ? (
        <AssetGridSkeleton columns={3} />
      ) : assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <i className="icon-image size-8 text-tertiary" />
          <p className="text-sm text-tertiary text-center">
            No assets uploaded yet.
          </p>
          <p className="text-xs text-tertiary text-center">
            Upload images to use in your page sections.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {assets.map((asset) => (
            <MyAssetCard
              key={asset._id}
              asset={asset}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stock Photos Tab
// ---------------------------------------------------------------------------

function StockPhotosTab({
  photos,
  isLoading,
  searchQuery,
  onSearchChange,
  onSelect,
}: {
  photos: StockPhoto[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelect: (photo: StockPhoto) => void;
}) {
  return (
    <div className="p-4 space-y-3">
      {/* Search */}
      <InputField
        iconLeft="icon-search"
        placeholder="Search stock photos..."
        value={searchQuery}
        onChangeText={onSearchChange}
      />

      {isLoading ? (
        <AssetGridSkeleton columns={2} />
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <i className="icon-search size-8 text-tertiary" />
          <p className="text-sm text-tertiary text-center">
            No photos found for &ldquo;{searchQuery}&rdquo;
          </p>
          <p className="text-xs text-tertiary text-center">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="columns-2 gap-2">
          {photos.map((photo) => (
            <StockPhotoCard
              key={photo.id}
              photo={photo}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}

      {/* Attribution notice */}
      {photos.length > 0 && (
        <p className="text-[10px] text-tertiary text-center pt-2">
          Photos provided by Unsplash. Click a photo to copy its URL.
        </p>
      )}
    </div>
  );
}
