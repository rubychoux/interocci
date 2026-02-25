import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled
          ? 'rgba(5,5,7,0.9)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(139,92,246,0.1)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, #5b3fa0, #2d1f4e)',
              border: '1px solid rgba(139,92,246,0.4)',
            }}
          >
            <span className="text-xs font-display font-semibold" style={{ color: '#a78bfa' }}>IO</span>
          </div>
          <span
            className="font-display text-xl tracking-widest"
            style={{ color: 'var(--text-primary)', letterSpacing: '0.3em' }}
          >
            INTEROCCI
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/explore"
            className="nav-link text-xs"
            style={{
              color: location.pathname === '/explore' ? 'var(--purple-bright)' : 'var(--text-secondary)',
            }}
          >
            EXPLORE
          </Link>
          <Link
            to="/about"
            className="nav-link text-xs"
            style={{ color: 'var(--text-secondary)' }}
          >
            ABOUT
          </Link>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button className="btn-ghost text-xs px-4 py-2 rounded-sm">
            SIGN IN
          </button>
          <button className="btn-primary text-xs px-4 py-2 rounded-sm">
            CREATE GALLERY
          </button>
        </div>
      </div>
    </nav>
  );
}
