import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const APPLE_CLIENT_ID = import.meta.env.VITE_APPLE_CLIENT_ID || '';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load the sign-in script'));
    document.head.appendChild(script);
  });
}

export default function Login() {
  const { isAuthenticated, loading, loginWithProvider, loginAsGuest } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/';
  const googleButtonRef = useRef(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const finishLogin = (data) => {
    loginWithProvider(data);
    navigate(from, { replace: true });
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) return undefined;
    let cancelled = false;

    const handleCredential = async (credential) => {
      setBusy(true);
      setError('');
      try {
        const data = await api.googleLogin(credential);
        finishLogin(data);
      } catch (err) {
        setError(err.message || 'Google sign-in failed');
      } finally {
        setBusy(false);
      }
    };

    loadScript('https://accounts.google.com/gsi/client')
      .then(() => {
        if (cancelled || !window.google?.accounts?.id) return;
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => handleCredential(response.credential),
        });
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'continue_with',
          logo_alignment: 'center',
        });
      })
      .catch(() => setError('Could not load Google sign-in. Check your connection.'));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GOOGLE_CLIENT_ID]);

  const handleProviderPending = () => {
    setError('Sign-in will be available soon. API keys are being configured.');
  };

  const handleAppleSignIn = async () => {
    setBusy(true);
    setError('');
    try {
      await loadScript('https://appleid.apple.com/appleid.auth');
      if (!window.AppleID) throw new Error('Apple sign-in is unavailable');
      window.AppleID.auth.init({
        clientId: APPLE_CLIENT_ID,
        scope: 'name email',
        redirectURI: `${window.location.origin}/login`,
        usePopup: true,
      });
      const response = await window.AppleID.auth.signIn();
      const idToken = response?.authorization?.id_token;
      if (!idToken) throw new Error('Apple sign-in was cancelled');
      const appleUser = response?.user?.name;
      const name = appleUser
        ? `${appleUser.firstName || ''} ${appleUser.lastName || ''}`.trim()
        : undefined;
      const data = await api.appleLogin(idToken, name);
      finishLogin(data);
    } catch (err) {
      setError(err.message || 'Apple sign-in failed');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <section className="login-page">
        <div className="container">
          <div className="login-card">
            <p className="login-note">Checking your session…</p>
          </div>
        </div>
      </section>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  return (
    <section className="login-page">
      <div className="container">
        <div className="login-card">
          <div className="login-icon">
            <i className="bx bx-map-pin" />
          </div>
          <h1 className="login-title">Sign in to CityVerse</h1>
          <p className="login-sub">
            Create a free account to view attraction details, photos and travel tips across Nepal.
          </p>

          {error && <div className="login-error">{error}</div>}

          <div className="login-provider-area">
            {GOOGLE_CLIENT_ID ? (
              <div ref={googleButtonRef} className="login-google-slot" />
            ) : (
              <button
                type="button"
                className="login-google-btn"
                onClick={() =>
                  setError('Google sign-in will be available soon. API keys are being configured.')
                }
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    fill="#FFC107"
                    d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 40.4 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"
                  />
                </svg>
                Continue with Google
              </button>
            )}

            <button
              type="button"
              className="login-apple-btn"
              onClick={APPLE_CLIENT_ID ? handleAppleSignIn : handleProviderPending}
              disabled={busy}
            >
              <i className="bx bxl-apple" /> Continue with Apple
            </button>
          </div>

          <button
            type="button"
            className="login-guest-btn"
            onClick={() => {
              const user = loginAsGuest();
              navigate(from, { replace: true });
            }}
            disabled={busy}
          >
            Continue as Guest
          </button>

          {busy && <p className="login-note">Signing you in…</p>}

          <div className="login-divider">or</div>

          <p className="login-note">
            Create a free account to view attraction details, photos and travel tips across Nepal.
          </p>
        </div>
      </div>
    </section>
  );
}
