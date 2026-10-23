import { useEffect, useState } from 'react';
import api from '../services/authSetup.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Usuarios() {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', usuario: '', password: '', rol: 'usuario' });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  function cargar() {
    api.get('/usuarios').then(res => setUsuarios(res.data)).catch(() => {
      setError('No se pudo cargar la lista de usuarios.');
    });
  }
  useEffect(() => { cargar(); }, []);

  async function crear(e) {
    e.preventDefault();
    setError(''); setMensaje('');
    setGuardando(true);
    try {
      await api.post('/usuarios', form);
      setForm({ nombre: '', usuario: '', password: '', rol: 'usuario' });
      setMensaje('Usuario creado.');
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear el usuario.');
    } finally {
      setGuardando(false);
    }
  }

  async function cambiarEstado(u) {
    setError(''); setMensaje('');
    try {
      await api.put(`/usuarios/${u.id_usuario}/estado`, { activo: !u.activo });
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cambiar el estado.');
    }
  }

  async function cambiarPassword(u) {
    const nueva = window.prompt(`Nueva contraseña para "${u.usuario}" (mínimo 8 caracteres):`);
    if (!nueva) return;
    setError(''); setMensaje('');
    try {
      await api.put(`/usuarios/${u.id_usuario}/password`, { password: nueva });
      setMensaje(`Contraseña de "${u.usuario}" actualizada.`);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cambiar la contraseña.');
    }
  }

  return (
    <>
      <div className="list-header">
        <div>
          <h1>Usuarios</h1>
          <p className="subtitle">
            Administrador: puede crear y modificar todo. Usuario: puede consultar y simular viajes.
          </p>
        </div>
      </div>

      {error && <p className="alerta">{error}</p>}
      {mensaje && (
        <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem' }}>
          {mensaje}
        </p>
      )}

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Nuevo usuario</h2>
        <form onSubmit={crear}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>Nombre</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Usuario</label>
              <input value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>Contraseña (mínimo 8 caracteres)</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div style={{ width: 200 }}>
              <label>Rol</label>
              <select value={form.rol} onChange={e => setForm({ ...form, rol: e.target.value })}>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <br />
          <button type="submit" className="btn-accent" disabled={guardando}>
            {guardando ? 'Creando...' : '+ Crear usuario'}
          </button>
        </form>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Nombre</th><th>Usuario</th><th>Rol</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id_usuario}>
                <td>{u.nombre}</td>
                <td className="mono">{u.usuario}</td>
                <td>{u.rol === 'admin' ? 'Administrador' : 'Usuario'}</td>
                <td>
                  {u.activo
                    ? <span style={{ color: '#2e7d32', fontWeight: 600 }}>Activo</span>
                    : <span className="helper-text">Inactivo</span>}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem', marginRight: 6 }}
                    onClick={() => cambiarPassword(u)}>
                    Cambiar contraseña
                  </button>
                  {u.id_usuario !== user.id_usuario && (
                    <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => cambiarEstado(u)}>
                      {u.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
