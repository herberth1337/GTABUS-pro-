import { useEffect, useState } from 'react';
import api from '../services/authSetup.js';

const TURNOS = [
  { valor: 'manana', etiqueta: 'Mañana' },
  { valor: 'tarde', etiqueta: 'Tarde' },
  { valor: 'noche', etiqueta: 'Noche' },
];
const etiquetaTurno = (v) => TURNOS.find(t => t.valor === v)?.etiqueta || v;

// Fecha de hoy en la zona horaria del navegador, como AAAA-MM-DD
const hoy = () => new Date().toLocaleDateString('en-CA');

export default function AsignarPilotos() {
  const [buses, setBuses] = useState([]);
  const [pilotos, setPilotos] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);

  const [form, setForm] = useState({ id_bus: '', id_piloto: '', fecha: hoy(), turno: 'manana' });
  const [filtroFecha, setFiltroFecha] = useState(hoy());
  const [todas, setTodas] = useState(false);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api.get('/buses').then(res => setBuses(res.data.filter(b => b.activo)));
    api.get('/pilotos').then(res => setPilotos(res.data.filter(p => p.activo)));
  }, []);

  function cargarAsignaciones() {
    const url = todas ? '/asignaciones' : `/asignaciones?fecha=${filtroFecha}`;
    api.get(url).then(res => setAsignaciones(res.data));
  }
  useEffect(() => { cargarAsignaciones(); }, [filtroFecha, todas]);

  async function asignar(e) {
    e.preventDefault();
    setError(''); setMensaje('');
    setGuardando(true);
    try {
      await api.post('/asignaciones', form);
      setMensaje('Piloto asignado.');
      setForm(f => ({ ...f, id_bus: '', id_piloto: '' }));
      // Se muestra el día que se acaba de asignar
      if (!todas && filtroFecha === form.fecha) cargarAsignaciones();
      else { setTodas(false); setFiltroFecha(form.fecha); }
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo asignar el piloto.');
    } finally {
      setGuardando(false);
    }
  }

  async function quitar(a) {
    if (!window.confirm(`¿Quitar a ${a.piloto} del bus ${a.placa}?`)) return;
    setError(''); setMensaje('');
    try {
      await api.delete(`/asignaciones/${a.id_asignacion}`);
      cargarAsignaciones();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo quitar la asignación.');
    }
  }

  return (
    <>
      <div className="list-header">
        <div>
          <h1>Asignar pilotos a buses</h1>
          <p className="subtitle">
            Un bus tiene un solo piloto por fecha y turno, y un piloto conduce un solo bus por fecha y turno.
          </p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Nueva asignación</h2>
        {error && <p className="alerta">{error}</p>}
        {mensaje && (
          <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem' }}>
            {mensaje}
          </p>
        )}
        <form onSubmit={asignar}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 2 }}>
              <label>Bus</label>
              <select value={form.id_bus} onChange={e => setForm({ ...form, id_bus: e.target.value })} required>
                <option value="">Selecciona un bus...</option>
                {buses.map(b => (
                  <option key={b.id_bus} value={b.id_bus}>{b.placa}{b.linea ? ` — ${b.linea}` : ' — sin línea'}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label>Piloto</label>
              <select value={form.id_piloto} onChange={e => setForm({ ...form, id_piloto: e.target.value })} required>
                <option value="">Selecciona un piloto...</option>
                {pilotos.map(p => (
                  <option key={p.id_piloto} value={p.id_piloto}>{p.nombres} {p.apellidos}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Fecha</label>
              <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Turno</label>
              <select value={form.turno} onChange={e => setForm({ ...form, turno: e.target.value })}>
                {TURNOS.map(t => <option key={t.valor} value={t.valor}>{t.etiqueta}</option>)}
              </select>
            </div>
          </div>
          <br />
          <button type="submit" className="btn-accent" disabled={guardando}>
            {guardando ? 'Asignando...' : 'Asignar piloto'}
          </button>
        </form>
      </div>

      <div className="list-toolbar">
        <label style={{ margin: 0 }}>Ver asignaciones del día</label>
        <input type="date" value={filtroFecha} disabled={todas}
          onChange={e => setFiltroFecha(e.target.value)} style={{ width: 180 }} />
        <label style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={todas} onChange={e => setTodas(e.target.checked)} style={{ width: 'auto' }} />
          Todas las fechas
        </label>
        <span className="result-count">
          {asignaciones.length} {asignaciones.length === 1 ? 'asignación' : 'asignaciones'}
        </span>
      </div>

      <div className="table-wrap">
        {asignaciones.length === 0 ? (
          <div className="empty-state">No hay asignaciones para mostrar.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Fecha</th><th>Turno</th><th>Bus</th><th>Línea</th><th>Piloto</th><th></th></tr>
            </thead>
            <tbody>
              {asignaciones.map(a => (
                <tr key={a.id_asignacion}>
                  <td className="mono">{a.fecha}</td>
                  <td>{etiquetaTurno(a.turno)}</td>
                  <td className="mono">{a.placa}</td>
                  <td>{a.linea ? <span className="badge-linea">{a.linea}</span> : <span className="helper-text">—</span>}</td>
                  <td>{a.piloto}</td>
                  <td>
                    <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                      onClick={() => quitar(a)}>
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
