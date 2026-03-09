import { useNavigate, Link } from 'react-router-dom';
import type { Gallery } from '../types';
import { useLikes } from '../hooks/useLikes';

function ArtistAvatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold flex-shrink-0"
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

export default function GalleryCard({ gallery }: { gallery: Gallery }) {
  const navigate = useNavigate();
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(gallery.id);

  return (
    <div
      className="gallery-card rounded-sm overflow-hidden group cursor-pointer"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(139,92,246,0.12)',
      }}
      onClick={() => navigate(`/gallery/${gallery.id}`)}
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

        {/* Heart button */}
        <button
          className="absolute top-3 right-3 z-10 text-base w-7 h-7 flex items-center justify-center rounded-full transition-colors"
          style={{ color: liked ? 'var(--purple-bright)' : 'rgba(255,255,255,0.45)' }}
          onClick={(e) => { e.stopPropagation(); toggleLike(gallery.id); }}
        >
          {liked ? '♥' : '♡'}
        </button>

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
        <Link
          to={`/artist/${gallery.artist.id}`}
          className="flex items-center gap-2.5 mb-3"
          onClick={(e) => e.stopPropagation()}
        >
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
        </Link>

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
          <span className="text-xs ml-auto" style={{ color: liked ? 'var(--purple-bright)' : 'var(--text-muted)' }}>
            {liked ? '♥' : '♡'} {(gallery.likes + (liked ? 1 : 0)).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
