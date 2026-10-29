import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const { login, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'ADMIN') {
        logout();
        setError('This account does not have admin access.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-brand">
          <i className="bx bx-globe" />
          <span>
            CityVerse<small>Admin</small>
          </span>
        </div>

        <h1>Admin Sign In</h1>
        <p>Manage attractions and categories for Butwal &amp; Bhairahawa.</p>

        {error && <div className="admin-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@cityverse.com"
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
            {submitting ? (
              <>
                <i className="bx bx-loader-alt bx-spin" /> Signing in…
              </>
            ) : (
              <>
                <i className="bx bx-log-in" /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="admin-login-links">
          <Link to="/">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}
