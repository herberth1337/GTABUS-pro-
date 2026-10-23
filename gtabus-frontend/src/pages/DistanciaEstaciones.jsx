import { useEffect, useState } from 'react';
import api from '../services/authSetup.js';

const km = (n) => Number(n).toLocaleString('es-GT', { minimumFractionDigits: 1, maximumFractionDigits: 2 });

export default function DistanciaEstaciones() {
  const [estaciones, setEstaciones] = useState([]);
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');
  const [calculando, setCalculando] = useState(false);

  useEffect(() => {
    api.get('/estaciones').then(res => setEstaciones(res.data));
  }, []);

  function intercambiar() {
    setOrigen(destino);
    setDestino(origen);
    setResultado(null);
    setError('');
  }

  async function calcular(e) {
    e.preventDefault();
    setError('');
    setResultado(null);
    setCalculando(true);
    try {
      const res = await api.get('/distancias', { params: { origen, destino } });
      setResultado(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo calcular la distancia.');
    } finally {
      setCalculando(false);
    }
  }

  return (
    <>
      <div className="list-header">
        <div>
          <h1>Distancia entre estaciones</h1>
          <p className="subtitle">
            Calcula la distancia de una estación a otra sumando los tramos de cada línea,
            con transbordos en las estaciones que comparten varias líneas.
          </p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={calcular}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={{ marginTop: 0 }}>Estación de origen</label>
              <select value={origen} onChange={e => setOrigen(e.target.value)} required>
                <option value="">Selecciona...</option>
                {estaciones.map(s => <option key={s.id_estacion} value={s.id_estacion}>{s.nombre}</option>)}
              </select>
            </div>
            <button type="button" className="btn-ghost" onClick={intercambiar}
              title="Intercambiar origen y destino" style={{ padding: '9px 12px' }}>
              ⇄
            </button>
            <div style={{ flex: 1 }}>
              <label style={{ marginTop: 0 }}>Estación de destino</label>
              <select value={destino} onChange={e => setDestino(e.target.value)} required>
                <option value="">Selecciona...</option>
                {estaciones.map(s => <option key={s.id_estacion} value={s.id_estacion}>{s.nombre}</option>)}
              </select>
            </div>
          </div>
          <br />
          <button type="submit" className="btn-accent" disabled={calculando}>
            {calculando ? 'Calculando...' : 'Calcular distancia'}
          </button>
        </form>
      </div>

      {error && <p className="alerta">{error}</p>}

      {resultado && (
        <div className="card">
          {resultado.tramos.length === 0 ? (
            <p style={{ margin: 0 }}>Origen y destino son la misma estación: <strong>0 km</strong>.</p>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, flexWrap: 'wrap' }}>
                <span className="mono" style={{ fontSize: '2.2rem', fontWeight: 600 }}>
                  {km(resultado.distancia_km)} km
                </span>
                <span className="helper-text" style={{ margin: 0 }}>
                  {resultado.origen.nombre} → {resultado.destino.nombre}
                </span>
              </div>
              <p className="helper-text" style={{ marginTop: 6 }}>
                {resultado.transbordos === 0
                  ? 'Sin transbordos: se recorre una sola línea.'
                  : `${resultado.transbordos} ${resultado.transbordos === 1 ? 'transbordo' : 'transbordos'}.`}
              </p>

              <h3 style={{ marginBottom: 8 }}>Recorrido</h3>
              {resultado.tramos.map((t, i) => (
                <div key={i}>
                  {i > 0 && (
                    <div className="helper-text" style={{ margin: '4px 0 4px 6px' }}>
                      ↳ Transbordo en <strong>{t.desde}</strong>
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                    <span className="badge-linea">{t.codigo_linea}</span>
                    <span>
                      {t.desde} <span className="helper-text">→</span> {t.hasta}
                    </span>
                    <span className="helper-text" style={{ marginLeft: 'auto' }}>
                      {t.paradas} {t.paradas === 1 ? 'estación' : 'estaciones'} · {km(t.km)} km
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
}
