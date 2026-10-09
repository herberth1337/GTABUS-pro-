import { useEffect, useState } from 'react';
import { BusService, ParqueoService } from '../services/api.js';

export default function CambiarParqueo() {
  const [buses, setBuses] = useState([]);
  const [parqueos, setParqueos] = useState([]);

  const [idBus, setIdBus] = useState('');
  const [busSeleccionado, setBusSeleccionado] = useState(null);
  const [nuevoParqueo, setNuevoParqueo] = useState('');
  const [historial, setHistorial] = useState([]);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    BusService.listar().then(res => setBuses(res.data));
    ParqueoService.listar().then(res => setParqueos(res.data));
  }, []);

  function seleccionarBus(id) {
    setIdBus(id);
    setMensaje('');
    setError('');
    const bus = buses.find(b => String(b.id_bus) === String(id));
    setBusSeleccionado(bus || null);
    setNuevoParqueo('');
    if (id) cargarHistorial(id);
  }

  function cargarHistorial(id) {
    BusService.historialParqueo(id).then(res => setHistorial(res.data));
  }

  async function handleCambiar(e) {
    e.preventDefault();
    setError('');
    setMensaje('');

    if (String(nuevoParqueo) === String(parqueoActualId())) {
      setError('Ese ya es el parqueo actual del bus.');
      return;
    }

    setGuardando(true);
    try {
      const res = await BusService.cambiarParqueo(idBus, { id_parqueo_actual: nuevoParqueo });
      const nombreNuevo = parqueos.find(p => String(p.id_parqueo) === String(nuevoParqueo))?.nombre;
      setBusSeleccionado(b => ({ ...b, id_parqueo_actual: res.data.id_parqueo_actual, parqueo_actual: nombreNuevo }));
      setMensaje(`Parqueo actualizado a "${nombreNuevo}". El bus nunca quedó sin parqueo asignado (Regla 7).`);
      setNuevoParqueo('');
      cargarHistorial(idBus);
      // Reflejar el cambio también en la lista general de buses
      setBuses(bs => bs.map(b => String(b.id_bus) === String(idBus)
        ? { ...b, parqueo_actual: nombreNuevo }
        : b));
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo cambiar el parqueo.');
    } finally {
      setGuardando(false);
    }
  }

  function parqueoActualId() {
    if (!busSeleccionado) return null;
    const p = parqueos.find(p => p.nombre === busSeleccionado.parqueo_actual);
    return p?.id_parqueo;
  }

  return (
    <>
      <div className="list-header">
        <div>
          <h1>Cambiar parqueo de un bus</h1>
          <p className="subtitle">
            Un bus puede cambiar de parqueo, pero nunca queda sin uno asignado (Regla 7).
            Cada cambio queda registrado en su bitácora.
          </p>
        </div>
      </div>

      <div className="card">
        <label>Bus</label>
        <select value={idBus} onChange={e => seleccionarBus(e.target.value)}>
          <option value="">Selecciona un bus...</option>
          {buses.map(b => (
            <option key={b.id_bus} value={b.id_bus}>
              {b.placa} {b.linea ? `— ${b.linea}` : '— sin línea asignada'}
            </option>
          ))}
        </select>

        {busSeleccionado && (
          <>
            <p className="helper-text" style={{ marginTop: 14 }}>
              Parqueo actual: <strong style={{ color: 'var(--text)' }}>{busSeleccionado.parqueo_actual}</strong>
            </p>

            {error && <p className="alerta">{error}</p>}
            {mensaje && (
              <p style={{
                background: '#e8f5e9', color: '#2e7d32', padding: '10px 14px',
                borderRadius: 8, fontSize: '0.9rem'
              }}>
                {mensaje}
              </p>
            )}

            <form onSubmit={handleCambiar}>
              <label>Nuevo parqueo</label>
              <select value={nuevoParqueo} onChange={e => setNuevoParqueo(e.target.value)} required>
                <option value="">Selecciona el parqueo destino...</option>
                {parqueos.map(p => (
                  <option key={p.id_parqueo} value={p.id_parqueo}>
                    {p.nombre} ({p.nombre_estacion}) — capacidad {p.capacidad_buses}
                  </option>
                ))}
              </select>

              <br /><br />
              <button type="submit" className="btn-accent" disabled={guardando}>
                {guardando ? 'Cambiando...' : 'Cambiar parqueo'}
              </button>
            </form>
          </>
        )}
      </div>

      {busSeleccionado && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Parqueo</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.length === 0 ? (
                <tr><td colSpan="4" className="empty-state">Sin historial todavía.</td></tr>
              ) : historial.map(h => (
                <tr key={h.id_historial}>
                  <td>{h.nombre_parqueo}</td>
                  <td className="mono">{new Date(h.fecha_inicio).toLocaleString('es-GT')}</td>
                  <td className="mono">{h.fecha_fin ? new Date(h.fecha_fin).toLocaleString('es-GT') : '—'}</td>
                  <td>
                    {h.fecha_fin
                      ? <span className="helper-text">Histórico</span>
                      : <span style={{ color: '#2e7d32', fontWeight: 600 }}>Vigente</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
