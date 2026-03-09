import { useState, useMemo } from 'react';
import { MOCK_GALLERIES } from '../data/galleries';
import type { FilterState, GalleryStyle, SortOption } from '../types';
import GalleryCard from '../components/GalleryCard';

const STYLES: { value: GalleryStyle | 'all'; label: string }[] = [
  { value: 'all', label: 'ALL' },
  { value: 'abstract', label: 'ABSTRACT' },
  { value: 'minimalist', label: 'MINIMALIST' },
  { value: 'digital', label: 'DIGITAL' },
  { value: 'immersive', label: 'IMMERSIVE' },
  { value: 'surreal', label: 'SURREAL' },
  { value: 'classical', label: 'CLASSICAL' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'trending', label: 'TRENDING' },
  { value: 'most-viewed', label: 'MOST VIEWED' },
  { value: 'most-liked', label: 'MOST LIKED' },
  { value: 'newest', label: 'NEWEST' },
];


export default function ExplorePage() {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    style: 'all',
    sort: 'trending',
  });

  const filtered = useMemo(() => {
    let result = [...MOCK_GALLERIES];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.artist.name.toLowerCase().includes(q) ||
          g.tags.some((t) => t.toLowerCase().includes(q)) ||
          g.description.toLowerCase().includes(q)
      );
    }

    if (filters.style !== 'all') {
      result = result.filter((g) => g.style === filters.style);
    }

    switch (filters.sort) {
      case 'most-viewed': result.sort((a, b) => b.views - a.views); break;
      case 'most-liked': result.sort((a, b) => b.likes - a.likes); break;
      case 'newest': result.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
      case 'trending': result.sort((a, b) => (b.views * 0.6 + b.likes * 0.4) - (a.views * 0.6 + a.likes * 0.4)); break;
    }

    return result;
  }, [filters]);

  return (
    <div className="min-h-screen pt-20 pb-24 grid-lines" style={{ background: 'var(--bg-void)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Page header */}
        <div className="py-12">
          <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            DISCOVER
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-primary)' }}>
            All Galleries
          </h1>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
              style={{ color: 'var(--text-muted)' }}
            >
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search galleries, artists, styles..."
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              className="w-full pl-8 pr-4 py-2.5 rounded-sm"
            />
          </div>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value as SortOption }))}
            className="px-4 py-2.5 rounded-sm"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Style filters */}
        <div className="flex gap-2 flex-wrap mb-10">
          {STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => setFilters((f) => ({ ...f, style: style.value }))}
              className="px-3 py-1.5 rounded-sm text-xs tracking-widest transition-all duration-200"
              style={{
                background: filters.style === style.value ? 'rgba(91,63,160,0.4)' : 'transparent',
                border: `1px solid ${filters.style === style.value ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.15)'}`,
                color: filters.style === style.value ? 'var(--purple-bright)' : 'var(--text-muted)',
                cursor: 'pointer',
              }}
            >
              {style.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
            {filtered.length} GALLERIES FOUND
          </p>
        </div>

        {/* Gallery grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div
              className="font-display text-5xl mb-4"
              style={{ color: 'var(--text-muted)' }}
            >
              ◎
            </div>
            <p className="font-display text-xl mb-2" style={{ color: 'var(--text-secondary)' }}>
              No galleries found
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Try a different search or style filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
