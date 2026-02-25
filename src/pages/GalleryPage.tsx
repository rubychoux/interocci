import { Suspense } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MOCK_GALLERIES } from '../data/galleries';
import GalleryViewer from '../components/GalleryViewer';

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

  if (!gallery) return <Navigate to="/explore" replace />;

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

        <div className="hidden md:flex items-center gap-4">
          <div
            className="w-6 h-6 rounded-sm flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #5b3fa0, #2d1f4e)',
              border: '1px solid rgba(139,92,246,0.4)',
            }}
          >
            <span className="text-xs font-display" style={{ color: '#a78bfa', fontSize: '0.5rem' }}>IO</span>
          </div>
          <span className="font-display text-sm tracking-widest" style={{ color: 'var(--text-primary)' }}>
            INTEROCCI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {gallery.views.toLocaleString()} views
          </span>
          <button className="btn-ghost text-xs px-3 py-1.5 rounded-sm">
            ♡ {gallery.likes.toLocaleString()}
          </button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 relative">
        <Suspense fallback={<LoadingRoom />}>
          <GalleryViewer gallery={gallery} />
        </Suspense>
      </div>
    </div>
  );
}
