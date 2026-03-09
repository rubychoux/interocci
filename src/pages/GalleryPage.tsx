import { Suspense, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MOCK_GALLERIES } from '../data/galleries';
import GalleryViewer from '../components/GalleryViewer';
import { useLikes } from '../hooks/useLikes';

function LoadingRoom() {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center"
      style={{ background: 'var(--bg-void)' }}
    >
      <div
        className="font-display text-6xl mb-6 animate-float"
        style={{ color: 'var(--purple-bright)' }}
      >
        ◎
      </div>
      <p className="text-xs tracking-widest animate-pulse" style={{ color: 'var(--text-muted)' }}>
        BUILDING YOUR GALLERY...
      </p>
    </div>
  );
}

export default function GalleryPage() {
  const { id } = useParams<{ id: string }>();
  const gallery = MOCK_GALLERIES.find((g) => g.id === id);

  const [immersive, setImmersive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { isLiked, toggleLike } = useLikes();

  if (!gallery) return <Navigate to="/explore" replace />;

  const liked = isLiked(gallery.id);
  const likeCount = gallery.likes + (liked ? 1 : 0);

  return (
    <div className="fixed inset-0 flex flex-col" style={{ background: 'var(--bg-void)' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 flex-shrink-0 z-20"
        style={{
          background: 'rgba(5,5,7,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(139,92,246,0.1)',
        }}
      >
        <Link
          to="/explore"
          className="flex items-center gap-2 text-xs nav-link"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← BACK TO EXPLORE
        </Link>

        <Link to="/" className="hidden md:flex items-center nav-link">
          <img src="/interocci-logo.png" alt="InterOcci" style={{ height: '32px', width: 'auto', filter: 'brightness(1)' }} />
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {gallery.views.toLocaleString()} views
          </span>
          <div className="relative">
            <button
              className="btn-ghost text-xs px-3 py-1.5 rounded-sm"
              style={{ color: liked ? 'var(--purple-bright)' : undefined }}
              onClick={() => {
                toggleLike(gallery.id);
                setShowTooltip(true);
                setTimeout(() => setShowTooltip(false), 2000);
              }}
            >
              {liked ? '♥' : '♡'} {likeCount.toLocaleString()}
            </button>
            {showTooltip && (
              <div
                className="absolute -bottom-8 right-0 text-xs whitespace-nowrap px-2 py-1 rounded-sm animate-fade-in"
                style={{ background: 'rgba(18,18,26,0.95)', color: 'var(--purple-bright)', border: '1px solid rgba(139,92,246,0.3)', zIndex: 30 }}
              >
                Saved to your likes
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <Suspense fallback={<LoadingRoom />}>
          <GalleryViewer
            gallery={gallery}
            immersive={immersive}
            onToggleImmersive={() => setImmersive(i => !i)}
            roomStyle={gallery.style}
          />
        </Suspense>
      </div>
    </div>
  );
}
