import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(usuario, password);
      navigate('/', { replace: true });
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Usuario o contraseña incorrectos.');
      } else if (err.response && err.response.status === 400) {
        setError(err.response.data.error);
      } else {
        setError('El servidor está despertando. Espera un minuto e inténtalo de nuevo.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div className="card" style={{ width: 380 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 2 }}>
          <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.1rem' }}>GTA</span>
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>BUS</span>
        </div>
        <p className="helper-text" style={{ marginTop: 0 }}>Control de Transmetro</p>

        <h2 style={{ margin: '18px 0 0' }}>Iniciar sesión</h2>
        {error && <p className="alerta" style={{ marginTop: 14 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Usuario</label>
          <input value={usuario} onChange={e => setUsuario(e.target.value)} autoFocus required />

          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          <br /><br />
          <button type="submit" className="btn-accent" disabled={enviando} style={{ width: '100%' }}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
