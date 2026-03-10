import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import { useAuth } from '../hooks/useAuth';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [modal, setModal] = useState<'signin' | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCreateGallery = () => {
    if (user) {
      navigate('/create');
    } else {
      setModal('signin');
    }
  };

  return (
    <>
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
        <Link to="/" className="flex items-center group">
          <img src="/interocci-logo.png" alt="InterOcci" style={{ height: '36px', width: 'auto' }} />
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
            to="/liked"
            className="nav-link text-xs"
            style={{
              color: location.pathname === '/liked' ? 'var(--purple-bright)' : 'var(--text-secondary)',
            }}
          >
            ♡ LIKED
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
          {user ? (
            <>
              <div
                className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(139,92,246,0.2)',
                  border: '1px solid rgba(139,92,246,0.5)',
                  color: 'var(--purple-bright)',
                }}
              >
                {user.email?.[0].toUpperCase()}
              </div>
              <button className="btn-primary text-xs px-4 py-2 rounded-sm" onClick={handleCreateGallery}>
                CREATE GALLERY
              </button>
              <button className="btn-ghost text-xs px-4 py-2 rounded-sm" onClick={() => signOut()}>
                SIGN OUT
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost text-xs px-4 py-2 rounded-sm" onClick={() => setModal('signin')}>
                SIGN IN
              </button>
              <button className="btn-primary text-xs px-4 py-2 rounded-sm" onClick={handleCreateGallery}>
                CREATE GALLERY
              </button>
            </>
          )}
        </div>
      </div>
    </nav>

    {modal && <AuthModal mode="signin" onClose={() => setModal(null)} redirectTo="/create" />}
    </>
  );
}
