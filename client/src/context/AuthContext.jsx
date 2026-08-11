import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!localStorage.getItem('paper_token')) return setLoading(false); api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => localStorage.removeItem('paper_token')).finally(() => setLoading(false)); }, []);
  const authenticate = async (path, values) => { const { data } = await api.post(path, values); localStorage.setItem('paper_token', data.token); setUser(data.user); return data; };
  const logout = () => { localStorage.removeItem('paper_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login: (v) => authenticate('/auth/login', v), register: (v) => authenticate('/auth/register', v), logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
