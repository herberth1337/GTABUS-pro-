import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/authSetup.js';

const km = (n) => Number(n).toLocaleString('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function EditarRuta() {
  const { id } = useParams();
  const [linea, setLinea] = useState(null);
  const [ruta, setRuta] = useState([]);
  const [todas, setTodas] = useState([]);

  const [valores, setValores] = useState({});      // lo que el admin está escribiendo por tramo
  const [guardandoId, setGuardandoId] = useState(null);

  const [form, setForm] = useState({ id_estacion: '', despues_de: 'FINAL', distancia_anterior: '', distancia_siguiente: '' });
  const [agregando, setAgregando] = useState(false);

  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  function cargar() {
    api.get('/lineas').then(res => setLinea(res.data.find(l => String(l.id_linea) === String(id)) || null));
    api.get(`/lineas/${id}/estaciones`).then(res => {
      setRuta(res.data);
      setValores({});
    });
  }
  useEffect(() => {
    cargar();
    api.get('/estaciones').then(res => setTodas(res.data));
  }, [id]);

  const idsEnRuta = new Set(ruta.map(r => r.id_estacion));
  const disponibles = todas.filter(e => !idsEnRuta.has(e.id_estacion));
  const ultima = ruta[ruta.length - 1];

  // Qué estación queda antes y cuál después de la nueva, según "Insertar después de"
  const indiceAnterior = form.despues_de === 'FINAL'
    ? ruta.length - 1
    : form.despues_de === 'INICIO' ? -1 : ruta.findIndex(r => String(r.id_estacion) === String(form.despues_de));
  const anterior = indiceAnterior >= 0 ? ruta[indiceAnterior] : null;
  const siguiente = ruta[indiceAnterior + 1] || null;

  async function guardarTramo(est) {
    setError(''); setMensaje('');
    setGuardandoId(est.id_estacion);
    try {
      const res = await api.put(`/lineas/${id}/ruta/${est.id_estacion}/distancia`, {
        distancia_siguiente_km: valores[est.id_estacion]
      });
      setMensaje(`Tramo actualizado. Distancia total de la línea: ${km(res.data.distancia_total_km)} km.`);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo guardar la distancia.');
    } finally {
      setGuardandoId(null);
    }
  }

  async function agregar(e) {
    e.preventDefault();
    setError(''); setMensaje('');
    setAgregando(true);
    try {
      const despues = form.despues_de === 'INICIO' ? null
        : form.despues_de === 'FINAL' ? (ultima ? ultima.id_estacion : null)
        : Number(form.despues_de);
      const res = await api.post(`/lineas/${id}/ruta/estaciones`, {
        id_estacion: Number(form.id_estacion),
        despues_de: despues,
        distancia_anterior: form.distancia_anterior,
        distancia_siguiente: form.distancia_siguiente,
      });
      const otras = res.data.otras_lineas;
      setMensaje(
        'Estación agregada a la ruta.' +
        (otras.length ? ` Ahora hay transbordo con: ${otras.join(', ')}.` : '')
      );
      setForm({ id_estacion: '', despues_de: 'FINAL', distancia_anterior: '', distancia_siguiente: '' });
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo agregar la estación.');
    } finally {
      setAgregando(false);
    }
  }

  if (!linea) return <p className="helper-text">Cargando...</p>;

  return (
    <>
      <div className="list-header">
        <div>
          <h1>Editar ruta · {linea.codigo}</h1>
          <p className="subtitle">
            {linea.nombre} — distancia total <strong>{km(linea.distancia_total_km)} km</strong>.
            Las distancias son aproximadas: corrígelas aquí si tienes datos oficiales.
          </p>
        </div>
        <Link to={`/lineas/${id}`}><button className="btn-ghost">← Volver a la línea</button></Link>
      </div>

      {error && <p className="alerta">{error}</p>}
      {mensaje && (
        <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem' }}>
          {mensaje}
        </p>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>#</th><th>Estación</th><th>Distancia a la siguiente (km)</th><th></th></tr>
          </thead>
          <tbody>
            {ruta.map(est => {
              const original = est.distancia_siguiente_km;
              const esUltima = est.id_estacion === ultima.id_estacion;
              const escrito = valores[est.id_estacion];
              const cambio = escrito !== undefined && escrito !== '' && Number(escrito) !== Number(original);
              return (
                <tr key={est.id_estacion}>
                  <td className="mono">{est.orden}</td>
                  <td>{est.nombre}</td>
                  <td style={{ width: 200 }}>
                    {esUltima ? <span className="helper-text">— (última estación)</span> : (
                      <input
                        type="number" step="0.01" min="0.01" max="50"
                        value={escrito !== undefined ? escrito : (original ?? '')}
                        onChange={e => setValores(v => ({ ...v, [est.id_estacion]: e.target.value }))}
                        style={{ width: 120 }}
                      />
                    )}
                  </td>
                  <td>
                    {!esUltima && (
                      <button className="btn-ghost" style={{ padding: '4px 12px', fontSize: '0.8rem' }}
                        disabled={!cambio || guardandoId === est.id_estacion}
                        onClick={() => guardarTramo(est)}>
                        {guardandoId === est.id_estacion ? 'Guardando...' : 'Guardar'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2 style={{ marginTop: 0 }}>Agregar una estación a la ruta</h2>
        <p className="helper-text" style={{ marginTop: -8 }}>
          Si la estación ya pertenece a otra línea, queda creado un transbordo entre las dos.
        </p>
        <form onSubmit={agregar}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label>Estación</label>
              <select value={form.id_estacion} onChange={e => setForm({ ...form, id_estacion: e.target.value })} required>
                <option value="">Selecciona...</option>
                {disponibles.map(s => <option key={s.id_estacion} value={s.id_estacion}>{s.nombre}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label>Posición en la ruta</label>
              <select value={form.despues_de} onChange={e => setForm({ ...form, despues_de: e.target.value })}>
                <option value="FINAL">Al final de la ruta</option>
                <option value="INICIO">Al inicio de la ruta</option>
                {ruta.map(r => <option key={r.id_estacion} value={r.id_estacion}>Después de {r.nombre}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {anterior && (
              <div style={{ flex: 1 }}>
                <label>Distancia desde {anterior.nombre} (km)</label>
                <input type="number" step="0.01" min="0.01" max="50" value={form.distancia_anterior}
                  onChange={e => setForm({ ...form, distancia_anterior: e.target.value })} required />
              </div>
            )}
            {siguiente && (
              <div style={{ flex: 1 }}>
                <label>Distancia hasta {siguiente.nombre} (km)</label>
                <input type="number" step="0.01" min="0.01" max="50" value={form.distancia_siguiente}
                  onChange={e => setForm({ ...form, distancia_siguiente: e.target.value })} required />
              </div>
            )}
          </div>
          <br />
          <button type="submit" className="btn-accent" disabled={agregando}>
            {agregando ? 'Agregando...' : '+ Agregar a la ruta'}
          </button>
        </form>
      </div>
    </>
  );
}
