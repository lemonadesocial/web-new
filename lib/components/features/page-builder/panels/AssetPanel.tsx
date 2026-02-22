'use client';

import React from 'react';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';

import { Button, Skeleton } from '$lib/components/core';
import { InputField } from '$lib/components/core/input/input-field';
import { drawer } from '$lib/components/core/dialog';
import { toast } from '$lib/components/core/toast';

import { ownerIdAtom } from '../store';
import type { SpaceAsset, StockPhoto } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AssetTab = 'my-assets' | 'stock';

// ---------------------------------------------------------------------------
// Mock Data (TODO: Replace with LIST_SPACE_ASSETS / SEARCH_STOCK_PHOTOS queries)
// ---------------------------------------------------------------------------

const MOCK_ASSETS: SpaceAsset[] = [
  {
    _id: 'asset_001',
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=400&fit=crop',
    type: 'image/jpeg',
    size: 245000,
    description: 'Conference hall',
  },
  {
    _id: 'asset_002',
    url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    type: 'image/jpeg',
    size: 312000,
    description: 'Festival crowd',
  },
  {
    _id: 'asset_003',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop',
    type: 'image/jpeg',
    size: 198000,
    description: 'Team collaboration',
  },
  {
    _id: 'asset_004',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    type: 'image/jpeg',
    size: 156000,
    description: 'Abstract gradient',
  },
  {
    _id: 'asset_005',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=400&fit=crop',
    type: 'image/jpeg',
    size: 280000,
    description: 'Event venue',
  },
  {
    _id: 'asset_006',
    url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop',
    type: 'image/jpeg',
    size: 340000,
    description: 'Concert stage',
  },
];

const MOCK_STOCK_PHOTOS: StockPhoto[] = [
  {
    id: 'stock_001',
    url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
    thumbnail_url: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400',
    width: 1200,
    height: 800,
    description: 'Concert crowd with lights',
    attribution: { photographer: 'John Doe', source: 'Unsplash', source_url: 'https://unsplash.com', license: 'Unsplash License' },
  },
  {
    id: 'stock_002',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    thumbnail_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400',
    width: 1200,
    height: 1600,
    description: 'Colorful confetti celebration',
    attribution: { photographer: 'Jane Smith', source: 'Unsplash', source_url: 'https://unsplash.com', license: 'Unsplash License' },
  },
  {
    id: 'stock_003',
    url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
    thumbnail_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
    width: 1200,
    height: 900,
    description: 'People at outdoor festival',
    attribution: { photographer: 'Mike Chen', source: 'Unsplash', source_url: 'https://unsplash.com', license: 'Unsplash License' },
  },
  {
    id: 'stock_004',
    url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800',
    thumbnail_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400',
    width: 800,
    height: 1200,
    description: 'Speaker on stage',
    attribution: { photographer: 'Alex Rivera', source: 'Unsplash', source_url: 'https://unsplash.com', license: 'Unsplash License' },
  },
  {
    id: 'stock_005',
    url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=800',
    thumbnail_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=400',
    width: 1200,
    height: 800,
    description: 'Friends gathering at table',
    attribution: { photographer: 'Sara Kim', source: 'Unsplash', source_url: 'https://unsplash.com', license: 'Unsplash License' },
  },
  {
    id: 'stock_006',
    url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
    thumbnail_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
    width: 1200,
    height: 1800,
    description: 'Modern conference room',
    attribution: { photographer: 'Tom Hill', source: 'Unsplash', source_url: 'https://unsplash.com', license: 'Unsplash License' },
  },
  {
    id: 'stock_007',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',
    thumbnail_url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400',
    width: 1200,
    height: 750,
    description: 'Neon lights abstract',
    attribution: { photographer: 'Lisa Park', source: 'Unsplash', source_url: 'https://unsplash.com', license: 'Unsplash License' },
  },
  {
    id: 'stock_008',
    url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    thumbnail_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400',
    width: 800,
    height: 1100,
    description: 'DJ performing live',
    attribution: { photographer: 'Dave Wong', source: 'Unsplash', source_url: 'https://unsplash.com', license: 'Unsplash License' },
  },
];

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
  const [assets, setAssets] = React.useState<SpaceAsset[]>([]);
  const [stockPhotos, setStockPhotos] = React.useState<StockPhoto[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSearching, setIsSearching] = React.useState(false);

  const ownerId = useAtomValue(ownerIdAtom);

  // --- Load my assets ---
  // TODO: Replace with LIST_SPACE_ASSETS query via useQuery
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setAssets(MOCK_ASSETS);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // --- Load stock photos ---
  // TODO: Replace with SEARCH_STOCK_PHOTOS query via useQuery
  React.useEffect(() => {
    if (activeTab !== 'stock') return;

    setIsSearching(true);
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        // Simulate filtered results
        const q = searchQuery.toLowerCase();
        setStockPhotos(
          MOCK_STOCK_PHOTOS.filter(
            (p) =>
              p.description?.toLowerCase().includes(q) ||
              p.attribution.photographer.toLowerCase().includes(q),
          ),
        );
      } else {
        setStockPhotos(MOCK_STOCK_PHOTOS);
      }
      setIsSearching(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [activeTab, searchQuery]);

  // --- Handlers ---

  const handleUpload = () => {
    // TODO: Wire up file input + ADD_SPACE_ASSET mutation
    toast.success('Upload feature coming soon');
  };

  const handleDeleteAsset = (assetId: string) => {
    // TODO: Wire up DELETE_SPACE_ASSET mutation
    setAssets((prev) => prev.filter((a) => a._id !== assetId));
    toast.success('Asset deleted');
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
