import { useEffect, useState } from 'react';
import api from '../services/authSetup.js';
import ListPage from '../components/ListPage.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Parqueos() {
  const { isAdmin } = useAuth();
  const [parqueos, setParqueos] = useState([]);
  const [buses, setBuses] = useState([]);
  const [estaciones, setEstaciones] = useState([]);

  function cargar() {
    api.get('/parqueos').then(res => setParqueos(res.data));
    api.get('/buses').then(res => setBuses(res.data));
  }

  useEffect(() => {
    cargar();
    if (isAdmin) api.get('/estaciones').then(res => setEstaciones(res.data));
  }, [isAdmin]);

  // Cuántos buses tiene asignados cada parqueo ahora mismo
  const filas = parqueos.map(p => ({
    ...p,
    buses_asignados: buses.filter(b => b.id_parqueo_actual === p.id_parqueo).length
  }));

  return (
    <>
      <ListPage
        title="Parqueos"
        subtitle="Parqueos de las estaciones, su capacidad y los buses asignados ahora."
        searchPlaceholder="Buscar por parqueo o estación..."
        data={filas}
        searchFn={(p, q) => {
          const t = q.toLowerCase();
          return p.nombre.toLowerCase().includes(t) ||
                 (p.nombre_estacion || '').toLowerCase().includes(t);
        }}
        columns={['Parqueo', 'Estación', 'Capacidad', 'Buses asignados', 'Ocupación']}
        emptyMessage="Todavía no hay parqueos registrados."
        renderRow={(p) => {
          const pct = p.capacidad_buses ? Math.round((p.buses_asignados / p.capacidad_buses) * 100) : 0;
          return (
            <tr key={p.id_parqueo}>
              <td>{p.nombre}</td>
              <td>{p.nombre_estacion}</td>
              <td className="mono">{p.capacidad_buses}</td>
              <td className="mono">{p.buses_asignados}</td>
              <td className="mono" style={{ color: pct > 100 ? 'var(--danger)' : undefined }}>{pct}%</td>
            </tr>
          );
        }}
      />

      {isAdmin && <NuevoParqueo estaciones={estaciones} onCreado={cargar} />}
    </>
  );
}

function NuevoParqueo({ estaciones, onCreado }) {
  const [form, setForm] = useState({ nombre: '', capacidad_buses: 30, id_estacion: '' });
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function crear(e) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await api.post('/parqueos', form);
      setForm({ nombre: '', capacidad_buses: 30, id_estacion: '' });
      onCreado();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear el parqueo.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: 16 }}>
      <h2 style={{ marginTop: 0 }}>Nuevo parqueo</h2>
      {error && <p className="alerta">{error}</p>}
      <form onSubmit={crear}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 2 }}>
            <label>Nombre</label>
            <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          </div>
          <div style={{ width: 140 }}>
            <label>Capacidad (buses)</label>
            <input type="number" min="1" value={form.capacidad_buses}
              onChange={e => setForm({ ...form, capacidad_buses: e.target.value })} required />
          </div>
          <div style={{ flex: 2 }}>
            <label>Estación</label>
            <select value={form.id_estacion} onChange={e => setForm({ ...form, id_estacion: e.target.value })} required>
              <option value="">Selecciona...</option>
              {estaciones.map(s => <option key={s.id_estacion} value={s.id_estacion}>{s.nombre}</option>)}
            </select>
          </div>
        </div>
        <br />
        <button type="submit" className="btn-accent" disabled={guardando}>
          {guardando ? 'Creando...' : '+ Crear parqueo'}
        </button>
      </form>
    </div>
  );
}
