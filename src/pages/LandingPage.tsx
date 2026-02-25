
import { Link } from 'react-router-dom';
import { Suspense } from 'react';
import HeroScene from '../components/HeroScene';
import { MOCK_GALLERIES } from '../data/galleries';

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div
        className="font-display text-4xl mb-1"
        style={{ color: 'var(--purple-bright)' }}
      >
        {value}
      </div>
      <div className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  );
}

function FeaturedGalleryCard({ gallery, index }: { gallery: typeof MOCK_GALLERIES[0]; index: number }) {
  return (
    <Link
      to={`/gallery/${gallery.id}`}
      className="gallery-card block rounded-sm overflow-hidden group"
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid rgba(139,92,246,0.15)',
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Cover */}
      <div
        className="h-48 relative overflow-hidden"
        style={{ background: '#0a0a14' }}
      >
        <img
          src={gallery.coverImage}
          alt=""
          className="object-cover w-full h-full absolute inset-0 opacity-80 transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(18,18,26,0.8) 0%, transparent 60%)' }}
        />
        {gallery.featured && (
          <div className="absolute top-3 right-3">
            <span className="tag">FEATURED</span>
          </div>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="tag">{gallery.style.toUpperCase()}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-xl mb-1" style={{ color: 'var(--text-primary)' }}>
          {gallery.title}
        </h3>
        <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
          {gallery.artist.name} · {gallery.artist.location}
        </p>
        <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-muted)' }}>
          {gallery.description}
        </p>
        <div className="flex items-center gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {gallery.artworks.length} works
          </span>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {gallery.views.toLocaleString()} views
          </span>
          <span className="text-xs ml-auto" style={{ color: 'var(--purple-bright)' }}>
            ENTER →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function LandingPage() {
  const featuredGalleries = MOCK_GALLERIES.filter((g) => g.featured);

  return (
    <div className="min-h-screen grid-lines" style={{ background: 'var(--bg-void)' }}>

      {/* Hero */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* 3D Scene */}
        <div className="absolute inset-0">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,7,0.7) 100%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
          style={{ background: 'linear-gradient(to top, var(--bg-void), transparent)' }}
        />

        {/* Hero text */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
          <div className="max-w-2xl">
            <div
              className="text-xs tracking-widest mb-6 animate-fade-in-up"
              style={{ color: 'var(--text-muted)', animationDelay: '0.1s', opacity: 0 }}
            >
              IMMERSIVE VR ART PLATFORM
            </div>

            <h1
              className="font-display animate-fade-in-up"
              style={{
                fontSize: 'clamp(3rem, 8vw, 6rem)',
                lineHeight: 1,
                color: 'var(--text-primary)',
                animationDelay: '0.25s',
                opacity: 0,
              }}
            >
              Where Art
              <br />
              <span className="shimmer-text">Transcends</span>
              <br />
              <span className="italic" style={{ color: 'var(--text-secondary)' }}>Space</span>
            </h1>

            <p
              className="text-sm leading-relaxed mt-6 animate-fade-in-up"
              style={{
                color: 'var(--text-secondary)',
                maxWidth: '420px',
                animationDelay: '0.4s',
                opacity: 0,
              }}
            >
              InterOcci transforms art into immersive 3D exhibitions.
              Walk through virtual galleries, discover artists from around the world,
              and experience art beyond the flat grid.
            </p>

            <div
              className="flex items-center gap-4 mt-8 animate-fade-in-up"
              style={{ animationDelay: '0.55s', opacity: 0 }}
            >
              <Link to="/explore">
                <button className="btn-primary px-8 py-3 text-xs rounded-sm">
                  EXPLORE GALLERIES
                </button>
              </Link>
              <button className="btn-ghost px-6 py-3 text-xs rounded-sm">
                CREATE YOUR GALLERY
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float"
          style={{ opacity: 0.4 }}
        >
          <div className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>SCROLL</div>
          <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, var(--purple-glow), transparent)' }} />
        </div>
      </section>

      {/* Stats bar */}
      <section
        className="py-12 relative"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          <StatCard value="100+" label="ARTISTS WORLDWIDE" />
          <StatCard value="20+" label="COUNTRIES" />
          <StatCard value="500+" label="GALLERIES" />
          <StatCard value="50K+" label="ARTWORKS" />
        </div>
      </section>

      {/* Featured galleries */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              CURATED SELECTION
            </p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}
            >
              Featured Galleries
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs nav-link hidden md:block"
            style={{ color: 'var(--purple-bright)' }}
          >
            VIEW ALL →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredGalleries.map((gallery, i) => (
            <FeaturedGalleryCard key={gallery.id} gallery={gallery} index={i} />
          ))}
        </div>
      </section>

      {/* Feature blocks */}
      <section
        className="py-24"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              THE PLATFORM
            </p>
            <h2
              className="font-display"
              style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}
            >
              Art Beyond the Grid
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '◈',
                title: 'Immersive 3D Galleries',
                desc: 'Walk through spatial exhibitions designed by artists. Every gallery is a world.',
              },
              {
                icon: '◉',
                title: 'AI-Generated Spaces',
                desc: 'Transform your 2D works into dynamic 3D gallery rooms with our AI engine.',
              },
              {
                icon: '◎',
                title: 'Global Artist Network',
                desc: 'Connect with creators across 20+ countries. The virtual lobby never sleeps.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-sm"
                style={{
                  background: 'rgba(18,18,26,0.6)',
                  border: '1px solid rgba(139,92,246,0.1)',
                }}
              >
                <div
                  className="font-display text-3xl mb-4 glow-text"
                  style={{ color: 'var(--purple-bright)' }}
                >
                  {feature.icon}
                </div>
                <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2
            className="font-display mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--text-primary)' }}
          >
            Ready to exhibit?
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            Build your virtual gallery in minutes. No VR headset required.
          </p>
          <button className="btn-primary px-10 py-4 text-xs rounded-sm animate-pulse-glow">
            START BUILDING — FREE
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-8 text-center"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}
      >
        <p className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
          © 2025 INTEROCCI · ART WITHOUT BORDERS
        </p>
      </footer>
    </div>
  );
}
