import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';

const STORAGE_KEY = 'cityverse_auth';

const AuthContext = createContext(null);

function readStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    const data = await api.login({ email, password });
    const next = { token: data.token, user: data.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setAuth(next);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  useEffect(() => {
    if (!auth?.token) return;
    setLoading(true);
    api
      .me(auth.token)
      .then((data) => {
        const next = { token: auth.token, user: data.user };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        setAuth(next);
      })
      .catch(() => logout())
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      user: auth?.user || null,
      token: auth?.token || null,
      isAuthenticated: Boolean(auth?.token),
      isAdmin: auth?.user?.role === 'ADMIN',
      loading,
      login,
      logout,
    }),
    [auth, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
