import { Link } from 'react-router-dom';
import { MOCK_GALLERIES } from '../data/galleries';
import { useLikes } from '../hooks/useLikes';
import GalleryCard from '../components/GalleryCard';

export default function LikedPage() {
  const { likedIds } = useLikes();
  const liked = MOCK_GALLERIES.filter((g) => likedIds.includes(g.id));

  return (
    <div className="min-h-screen pt-20 pb-24 grid-lines" style={{ background: 'var(--bg-void)' }}>
      <div className="max-w-7xl mx-auto px-6">

        {/* Page header */}
        <div className="py-12">
          <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            YOUR COLLECTION
          </p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', color: 'var(--text-primary)' }}>
            Liked Galleries
          </h1>
        </div>

        {liked.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liked.map((gallery) => (
              <GalleryCard key={gallery.id} gallery={gallery} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="font-display text-6xl mb-6 animate-float" style={{ color: 'var(--text-muted)' }}>
              ◎
            </div>
            <h2 className="font-display text-2xl mb-3" style={{ color: 'var(--text-secondary)' }}>
              No liked galleries yet
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
              Explore galleries and save your favorites
            </p>
            <Link to="/explore">
              <button className="btn-primary px-8 py-3 text-xs rounded-sm">
                EXPLORE GALLERIES
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
