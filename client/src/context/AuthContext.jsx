import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('luma_token')));

  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('luma:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('luma:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('luma_token')) return;
    api('/auth/me')
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem('luma_token'))
      .finally(() => setLoading(false));
  }, []);

  const saveSession = useCallback(({ token, user: nextUser }) => {
    localStorage.setItem('luma_token', token);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signIn = useCallback(async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    return saveSession(data);
  }, [saveSession]);

  const register = useCallback(async (name, email, password) => {
    const data = await api('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
    return saveSession(data);
  }, [saveSession]);


  const signOut = useCallback(() => {
    localStorage.removeItem('luma_token');
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, loading, signIn, register, signOut }), [user, loading, signIn, register, signOut]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);


