import { useParams, Navigate } from 'react-router-dom';
import { MOCK_GALLERIES, ARTISTS } from '../data/galleries';
import GalleryCard from '../components/GalleryCard';

export default function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const artist = ARTISTS.find((a) => a.id === id);

  if (!artist) return <Navigate to="/explore" replace />;

  const galleries = MOCK_GALLERIES.filter((g) => g.artist.id === id);
  const totalViews = galleries.reduce((sum, g) => sum + g.views, 0);
  const totalLikes = galleries.reduce((sum, g) => sum + g.likes, 0);
  const heroCover = galleries[0]?.coverImage;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-void)' }}>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: '380px' }}>
        {heroCover && (
          <img
            src={heroCover}
            alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            style={{ opacity: 0.15, filter: 'blur(20px)', transform: 'scale(1.1)' }}
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(5,5,7,0.5) 0%, var(--bg-void) 100%)' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-16 flex flex-col md:flex-row gap-8 items-center md:items-end">
          {/* Avatar */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-2xl flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #5b3fa0, #2d1f4e)',
              border: '2px solid rgba(139,92,246,0.5)',
              color: 'var(--purple-bright)',
            }}
          >
            {artist.avatar}
          </div>

          {/* Info */}
          <div>
            <h1
              className="font-display"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)', lineHeight: 1 }}
            >
              {artist.name}
              {artist.verified && (
                <span className="ml-3 text-2xl" style={{ color: 'var(--purple-bright)' }}>◈</span>
              )}
            </h1>

            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{artist.handle}</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>· {artist.location}</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>· {artist.followers.toLocaleString()} followers</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10 mt-6">
              <div>
                <div className="font-display text-2xl" style={{ color: 'var(--purple-bright)' }}>{galleries.length}</div>
                <div className="text-xs tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>GALLERIES</div>
              </div>
              <div>
                <div className="font-display text-2xl" style={{ color: 'var(--purple-bright)' }}>{totalViews.toLocaleString()}</div>
                <div className="text-xs tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>TOTAL VIEWS</div>
              </div>
              <div>
                <div className="font-display text-2xl" style={{ color: 'var(--purple-bright)' }}>{totalLikes.toLocaleString()}</div>
                <div className="text-xs tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>TOTAL LIKES</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Galleries */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-xs tracking-widest mb-8" style={{ color: 'var(--text-muted)' }}>GALLERIES</p>

        {galleries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleries.map((g) => (
              <GalleryCard key={g.id} gallery={g} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="font-display text-5xl mb-4" style={{ color: 'var(--text-muted)' }}>◎</div>
            <p className="font-display text-xl" style={{ color: 'var(--text-secondary)' }}>No galleries yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
