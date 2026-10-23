import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/authSetup.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gtabus_user')); }
    catch { return null; }
  });

  function logout() {
    localStorage.removeItem('gtabus_token');
    localStorage.removeItem('gtabus_user');
    setUser(null);
  }

  async function login(usuario, password) {
    const res = await api.post('/auth/login', { usuario, password });
    localStorage.setItem('gtabus_token', res.data.token);
    localStorage.setItem('gtabus_user', JSON.stringify(res.data.usuario));
    setUser(res.data.usuario);
  }

  // Si el servidor dice que la sesión venció, se cierra sola.
  useEffect(() => {
    window.addEventListener('gtabus:logout', logout);
    return () => window.removeEventListener('gtabus:logout', logout);
  }, []);

  const value = { user, isAdmin: user?.rol === 'admin', login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
