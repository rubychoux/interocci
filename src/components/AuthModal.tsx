import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type Mode = 'signin' | 'create';

export default function AuthModal({ mode, onClose, redirectTo }: { mode: Mode; onClose: () => void; redirectTo?: string }) {
  const [view, setView] = useState<'signin' | 'signup'>(mode === 'create' ? 'signup' : 'signin');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ background: 'rgba(5,5,7,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full mx-4 p-10 rounded-sm animate-fade-in-up"
        style={{
          maxWidth: '420px',
          background: 'linear-gradient(135deg, rgba(18,18,26,0.98), rgba(10,10,16,0.98))',
          border: '1px solid rgba(139,92,246,0.3)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-ghost text-xs px-2 py-1 rounded-sm"
        >
          ✕ CLOSE
        </button>

        {view === 'signin' ? (
          <SignInView onSwitchToSignup={() => setView('signup')} onClose={onClose} redirectTo={redirectTo} />
        ) : (
          <CreateView onSwitchToSignin={() => setView('signin')} />
        )}
      </div>
    </div>
  );
}

function SignInView({ onSwitchToSignup, onClose, redirectTo }: { onSwitchToSignup: () => void; onClose: () => void; redirectTo?: string }) {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      onClose();
      if (redirectTo) navigate(redirectTo);
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          WELCOME BACK
        </p>
        <h2 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>
          Sign In
        </h2>
      </div>

      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-2.5 rounded-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2.5 rounded-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>
      )}

      <button type="submit" className="btn-primary w-full py-3 text-xs rounded-sm" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            SIGNING IN...
          </span>
        ) : 'SIGN IN'}
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.15)' }} />
        <span className="text-xs tracking-widest" style={{ color: 'var(--text-muted)' }}>OR</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.15)' }} />
      </div>

      <button
        type="button"
        className="btn-ghost w-full py-3 text-xs rounded-sm flex items-center justify-center gap-2"
        disabled={googleLoading}
        onClick={async () => {
          setGoogleLoading(true);
          await signInWithGoogle();
        }}
      >
        {googleLoading ? (
          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}
        {googleLoading ? 'REDIRECTING...' : 'Continue with Google'}
      </button>

      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="nav-link"
          style={{ color: 'var(--purple-bright)' }}
        >
          Create one
        </button>
      </p>
    </form>
  );
}

function CreateView({ onSwitchToSignin }: { onSwitchToSignin: () => void }) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div>
          <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
            ALMOST THERE
          </p>
          <h2 className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
            Check Your Email
          </h2>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Check your email to confirm your account
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <p className="text-xs tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
          JOIN INTEROCCI
        </p>
        <h2 className="font-display text-2xl" style={{ color: 'var(--text-primary)' }}>
          Create Your Gallery
        </h2>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--purple-bright)' }}>Account</span>
        <span>→</span>
        <span>Gallery Info</span>
        <span>→</span>
        <span>Upload Works</span>
      </div>

      <p className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'Space Mono', monospace" }}>
        Join 100+ artists across 20+ countries.
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Full name"
          className="w-full px-4 py-2.5 rounded-sm"
        />
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-2.5 rounded-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2.5 rounded-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && (
        <p className="text-xs" style={{ color: '#f87171' }}>{error}</p>
      )}

      <button type="submit" className="btn-primary w-full py-3 text-xs rounded-sm" disabled={loading}>
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            CREATING...
          </span>
        ) : 'NEXT →'}
      </button>

      <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignin}
          className="nav-link"
          style={{ color: 'var(--purple-bright)' }}
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
