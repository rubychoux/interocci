import { Link } from 'react-router-dom';

function Divider() {
  return (
    <div
      className="w-12 h-px my-8"
      style={{ background: 'linear-gradient(to right, var(--purple-glow), transparent)' }}
    />
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen grid-lines" style={{ background: 'var(--bg-void)' }}>

      {/* Hero */}
      <section className="relative overflow-hidden pt-40 pb-24">
        {/* Full-width background image */}
        <img
          src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=1600&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: 0.3 }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, var(--bg-void) 100%)' }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <p
            className="text-xs tracking-widest mb-6 animate-fade-in-up"
            style={{ color: 'var(--text-muted)', opacity: 0, animationDelay: '0.05s' }}
          >
            ABOUT
          </p>
          <h1
            className="font-display animate-fade-in-up"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              lineHeight: 1.0,
              color: 'var(--text-primary)',
              opacity: 0,
              animationDelay: '0.15s',
            }}
          >
            About
            <br />
            <span className="shimmer-text">InterOcci</span>
          </h1>
          <p
            className="mt-8 text-base leading-relaxed max-w-xl animate-fade-in-up"
            style={{
              color: 'var(--text-secondary)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.875rem',
              opacity: 0,
              animationDelay: '0.3s',
            }}
          >
            Bridging traditional art exhibitions and the digital world —
            one immersive gallery at a time.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section
        className="py-24"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs tracking-widest mb-10" style={{ color: 'var(--text-muted)' }}>
            OUR MISSION
          </p>
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Side image — ~40% width on desktop */}
            <div className="flex-shrink-0 w-full md:w-2/5 rounded-sm overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&q=80"
                alt="Art gallery interior"
                className="w-full object-cover rounded-sm"
                style={{ height: '320px' }}
              />
            </div>
            {/* Heading + text */}
            <div>
              <h2
                className="font-display mb-8"
                style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)', lineHeight: 1.1 }}
              >
                Art without walls.
              </h2>
              <div
                className="space-y-5 text-sm leading-relaxed"
                style={{ color: 'var(--text-secondary)', fontFamily: "'Space Mono', monospace" }}
              >
                <p>
                  InterOcci is a platform for visual artists to design and publish personalized
                  3D immersive exhibitions — navigable from any browser, no headset required.
                  We believe a painting deserves the same spatial presence online as it has on a
                  gallery wall.
                </p>
                <p>
                  The idea came from research with over 100 artists across Asia, Europe, and
                  North America. Nearly all of them described the same frustration: static image
                  grids flatten their work, strip away context, and fail to communicate the
                  scale and atmosphere that make a physical show meaningful.
                </p>
                <p>
                  InterOcci solves that. Artists configure a room — lighting, wall colour, artwork
                  placement — and publish a living 3D space that collectors, curators, and fans
                  can walk through in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section
        className="py-24"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs tracking-widest mb-12" style={{ color: 'var(--text-muted)' }}>
            FOUNDER
          </p>

          <div
            className="p-8 md:p-10 rounded-sm flex flex-col md:flex-row gap-8 items-start"
            style={{
              background: 'rgba(18,18,26,0.7)',
              border: '1px solid rgba(139,92,246,0.18)',
              boxShadow: '0 0 60px rgba(91,63,160,0.06)',
            }}
          >
            {/* Profile photo */}
            <div className="flex-shrink-0">
              <img
                src="/profile.jpg"
                alt="Ruby Choux Kim"
                className="rounded-full object-cover"
                style={{ width: '120px', height: '120px', border: '2px solid rgba(139,92,246,0.4)' }}
              />
            </div>

            {/* Info */}
            <div>
              <h3
                className="font-display mb-1"
                style={{ fontSize: '1.75rem', color: 'var(--text-primary)' }}
              >
                Ruby Choux Kim
              </h3>
              <p
                className="text-xs tracking-widest mb-4"
                style={{ color: 'var(--purple-bright)' }}
              >
                FOUNDER &amp; CEO
              </p>
              <Divider />
              <p
                className="text-sm leading-relaxed max-w-lg"
                style={{ color: 'var(--text-secondary)', fontFamily: "'Space Mono', monospace" }}
              >
                A Georgia Tech CS graduate specialising in Intelligence &amp; Media, Ruby founded
                InterOcci in 2022 after spending three years researching how digital presentation
                shapes the perceived value of fine art. Frustrated by the gap between the
                richness of a physical exhibition and the flatness of an online image grid, she
                set out to build the infrastructure artists actually need — spatial, atmospheric,
                and entirely theirs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-20"
        style={{ borderTop: '1px solid rgba(139,92,246,0.1)', borderBottom: '1px solid rgba(139,92,246,0.1)' }}
      >
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: '100+', label: 'ARTISTS WORLDWIDE' },
            { value: '20+',  label: 'COUNTRIES' },
            { value: '500+', label: 'GALLERIES' },
            { value: '50K+', label: 'ARTWORKS' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div
                className="font-display text-4xl mb-2"
                style={{ color: 'var(--purple-bright)' }}
              >
                {value}
              </div>
              <div className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech / CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>
              THE PLATFORM
            </p>
            <h2
              className="font-display mb-6"
              style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', color: 'var(--text-primary)', lineHeight: 1.1 }}
            >
              Built for artists,<br />powered by the web.
            </h2>
            <p
              className="text-sm leading-relaxed mb-8"
              style={{ color: 'var(--text-secondary)', fontFamily: "'Space Mono', monospace" }}
            >
              InterOcci is built on React, WebGL, and a growing suite of AI tools that
              help artists generate gallery layouts, relight scenes, and reach audiences
              they'd never find through a static portfolio site.
            </p>
            <Link to="/explore">
              <button className="btn-primary px-8 py-3 text-xs rounded-sm">
                EXPLORE GALLERIES
              </button>
            </Link>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              { icon: '◈', title: 'Immersive 3D Galleries', desc: 'WebGL-powered rooms navigable in any modern browser.' },
              { icon: '◉', title: 'AI Layout Engine', desc: 'Generate exhibition layouts from a set of uploaded works.' },
              { icon: '◎', title: 'Global Reach', desc: 'Publish once — collectors and curators worldwide can attend.' },
            ].map((f) => (
              <div
                key={f.title}
                className="flex gap-4 p-5 rounded-sm"
                style={{
                  background: 'rgba(18,18,26,0.5)',
                  border: '1px solid rgba(139,92,246,0.1)',
                }}
              >
                <span
                  className="font-display text-2xl flex-shrink-0 glow-text"
                  style={{ color: 'var(--purple-bright)' }}
                >
                  {f.icon}
                </span>
                <div>
                  <p className="font-display text-base mb-1" style={{ color: 'var(--text-primary)' }}>
                    {f.title}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
