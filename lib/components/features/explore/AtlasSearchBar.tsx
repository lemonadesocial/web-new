'use client';

import { useState } from 'react';

import type { AtlasSearchParams } from '$lib/types/atlas';

interface AtlasSearchBarProps {
  onSearch: (params: AtlasSearchParams) => void;
  loading?: boolean;
}

const CATEGORIES = ['Music', 'Tech', 'Arts', 'Sports', 'Food', 'Business', 'Social', 'Other'];

export function AtlasSearchBar({ onSearch, loading }: AtlasSearchBarProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [priceMax, setPriceMax] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params: AtlasSearchParams = {};
    if (query.trim()) params.query = query.trim();
    if (category) params.category = category;
    if (dateFrom) params.date_from = dateFrom;
    if (dateTo) params.date_to = dateTo;
    if (priceMax) params.price_max = Number(priceMax);
    params.limit = 20;
    onSearch(params);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search events across all platforms..."
          className="flex-1 px-3 py-2 rounded-md border border-card-border bg-overlay-secondary text-primary text-sm placeholder:text-quaternary focus:outline-none focus:ring-1 focus:ring-accent-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-md bg-accent-400 text-white text-sm font-medium hover:bg-accent-400/90 transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-2.5 py-1.5 rounded-md border border-card-border bg-overlay-secondary text-secondary text-xs focus:outline-none focus:ring-1 focus:ring-accent-400"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat.toLowerCase()}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          placeholder="From"
          className="px-2.5 py-1.5 rounded-md border border-card-border bg-overlay-secondary text-secondary text-xs focus:outline-none focus:ring-1 focus:ring-accent-400"
        />

        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          placeholder="To"
          className="px-2.5 py-1.5 rounded-md border border-card-border bg-overlay-secondary text-secondary text-xs focus:outline-none focus:ring-1 focus:ring-accent-400"
        />

        <input
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          placeholder="Max price"
          min={0}
          className="w-24 px-2.5 py-1.5 rounded-md border border-card-border bg-overlay-secondary text-secondary text-xs focus:outline-none focus:ring-1 focus:ring-accent-400"
        />
      </div>
    </form>
  );
}
