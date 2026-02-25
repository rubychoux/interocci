import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_GALLERIES } from '../data/galleries';
import type { FilterState, GalleryStyle, SortOption } from '../types';

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

function ArtistAvatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: 'linear-gradient(135deg, #5b3fa0, #2d1f4e)',
        border: '1px solid rgba(139,92,246,0.3)',
        color: 'var(--purple-bright)',
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}

function GalleryCard({ gallery }: { gallery: typeof MOCK_GALLERIES[0] }) {
  return (
    <Link
      to={`/gallery/${gallery.id}`}
      className="gallery-card block rounded-sm overflow-hidden group"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(139,92,246,0.12)',
      }}
    >
      {/* Cover image */}
      <div className="relative h-44 overflow-hidden" style={{ background: '#0a0a14' }}>
        <img
          src={gallery.coverImage}
          alt=""
          className="object-cover w-full h-full absolute inset-0 opacity-80 transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'rgba(91,63,160,0.15)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(18,18,26,0.9) 0%, transparent 50%)' }}
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {gallery.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag">{tag.toUpperCase()}</span>
          ))}
        </div>

        {/* Enter hint */}
        <div
          className="absolute bottom-3 right-3 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: 'var(--purple-bright)' }}
        >
          ENTER GALLERY →
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Artist */}
        <div className="flex items-center gap-2.5 mb-3">
          <ArtistAvatar initials={gallery.artist.avatar} />
          <div className="min-w-0">
            <p className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>
              {gallery.artist.name}
              {gallery.artist.verified && (
                <span className="ml-1.5" style={{ color: 'var(--purple-bright)' }}>◈</span>
              )}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
              {gallery.artist.location}
            </p>
          </div>
        </div>

        <h3 className="font-display text-lg mb-1.5 leading-tight" style={{ color: 'var(--text-primary)' }}>
          {gallery.title}
        </h3>
        <p
          className="text-xs leading-relaxed"
          style={{
            color: 'var(--text-muted)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {gallery.description}
        </p>

        {/* Stats */}
        <div
          className="flex items-center gap-4 mt-3 pt-3"
          style={{ borderTop: '1px solid rgba(139,92,246,0.08)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {gallery.artworks.length} works
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {gallery.views.toLocaleString()} views
          </span>
          <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>
            ♡ {gallery.likes.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

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
