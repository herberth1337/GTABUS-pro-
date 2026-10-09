import { useEffect, useState } from 'react';
import { LineaService, PilotoService, ViajeService } from '../services/api.js';

export default function SimularViaje() {
  const [lineas, setLineas] = useState([]);
  const [pilotos, setPilotos] = useState([]);

  const [idLinea, setIdLinea] = useState('');
  const [buses, setBuses] = useState([]);
  const [estaciones, setEstaciones] = useState([]);

  const [idBus, setIdBus] = useState('');
  const [idPiloto, setIdPiloto] = useState('');

  const [viaje, setViaje] = useState(null);       // { id_viaje, ... }
  const [busActivo, setBusActivo] = useState(null); // objeto bus con capacidad_maxima
  const [resultados, setResultados] = useState({}); // { [id_estacion]: resultado }
  const [pasajerosPorEstacion, setPasajerosPorEstacion] = useState({});
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    LineaService.listar().then(res => setLineas(res.data));
    PilotoService.listar().then(res => setPilotos(res.data));
  }, []);

  useEffect(() => {
    if (!idLinea) { setBuses([]); setEstaciones([]); return; }
    LineaService.buses(idLinea).then(res => setBuses(res.data));
    LineaService.estaciones(idLinea).then(res => setEstaciones(res.data));
    setViaje(null);
    setResultados({});
  }, [idLinea]);

  async function iniciarViaje(e) {
    e.preventDefault();
    setError('');
    setCreando(true);
    try {
      const res = await ViajeService.crear({ id_bus: idBus, id_linea: idLinea, id_piloto: idPiloto });
      setViaje(res.data);
      setBusActivo(buses.find(b => String(b.id_bus) === String(idBus)));
      setResultados({});
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo iniciar el viaje.');
    } finally {
      setCreando(false);
    }
  }

  async function registrarLlegada(estacion) {
    const pasajeros = Number(pasajerosPorEstacion[estacion.id_estacion] || 0);
    try {
      const res = await ViajeService.registrarVisita({
        id_viaje: viaje.id_viaje,
        id_estacion: estacion.id_estacion,
        orden_visita: estacion.orden,
        pasajeros_abordo: pasajeros
      });
      setResultados(r => ({ ...r, [estacion.id_estacion]: res.data }));
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo registrar la visita.');
    }
  }

  function reiniciar() {
    setViaje(null);
    setBusActivo(null);
    setResultados({});
    setPasajerosPorEstacion({});
    setIdBus('');
    setIdPiloto('');
  }

  return (
    <>
      <div className="list-header">
        <div>
          <h1>Simular viaje</h1>
          <p className="subtitle">
            Registra el paso de un bus por cada estación de su ruta y observa las
            alertas de sobrecupo (Regla 14) y espera extendida (Regla 15) en tiempo real.
          </p>
        </div>
      </div>

      {error && <p className="alerta">{error}</p>}

      {!viaje ? (
        <div className="card">
          <h2 style={{ marginTop: 0 }}>1. Iniciar viaje</h2>
          <form onSubmit={iniciarViaje}>
            <label>Línea</label>
            <select value={idLinea} onChange={e => setIdLinea(e.target.value)} required>
              <option value="">Selecciona una línea...</option>
              {lineas.map(l => (
                <option key={l.id_linea} value={l.id_linea}>{l.codigo} — {l.nombre}</option>
              ))}
            </select>

            <label>Bus</label>
            <select value={idBus} onChange={e => setIdBus(e.target.value)} required disabled={!idLinea}>
              <option value="">Selecciona un bus...</option>
              {buses.map(b => (
                <option key={b.id_bus} value={b.id_bus}>
                  {b.placa} — capacidad {b.capacidad_maxima}
                </option>
              ))}
            </select>

            <label>Piloto</label>
            <select value={idPiloto} onChange={e => setIdPiloto(e.target.value)} required>
              <option value="">Selecciona un piloto...</option>
              {pilotos.map(p => (
                <option key={p.id_piloto} value={p.id_piloto}>{p.nombres} {p.apellidos}</option>
              ))}
            </select>

            <br /><br />
            <button type="submit" className="btn-accent" disabled={creando}>
              {creando ? 'Iniciando...' : 'Iniciar viaje'}
            </button>
          </form>
        </div>
      ) : (
        <>
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong className="mono">{busActivo?.placa}</strong>
              <span className="helper-text"> — capacidad máxima: {busActivo?.capacidad_maxima} pasajeros</span>
            </div>
            <button className="btn-ghost" onClick={reiniciar}>Terminar / nuevo viaje</button>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Estación</th>
                  <th>Pasajeros a bordo</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {estaciones.map(est => {
                  const resultado = resultados[est.id_estacion];
                  return (
                    <tr key={est.id_estacion}>
                      <td>{est.orden}</td>
                      <td>{est.nombre}</td>
                      <td style={{ maxWidth: 160 }}>
                        {resultado ? (
                          <span className="mono">{resultado.pasajeros_abordo}</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <input
                              type="number"
                              min="0"
                              style={{ width: 90 }}
                              value={pasajerosPorEstacion[est.id_estacion] || ''}
                              onChange={e => setPasajerosPorEstacion(p => ({
                                ...p, [est.id_estacion]: e.target.value
                              }))}
                            />
                            <button
                              className="btn-ghost"
                              style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                              onClick={() => registrarLlegada(est)}
                            >
                              Registrar
                            </button>
                          </div>
                        )}
                      </td>
                      <td>
                        {resultado && <ResultadoBadge resultado={resultado} />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

function ResultadoBadge({ resultado }) {
  const pct = Number(resultado.ocupacion_pct).toFixed(0);

  if (resultado.genero_alerta_sobrecupo) {
    return (
      <span className="alerta" style={{ margin: 0, display: 'inline-block' }}>
        ⚠️ {pct}% de ocupación — se generó alerta de sobrecupo (Regla 14): se necesita otra unidad.
      </span>
    );
  }
  if (resultado.minutos_espera_extra > 0) {
    return (
      <span style={{
        background: '#fff4de', color: '#8a5a00', padding: '6px 10px',
        borderRadius: 8, fontSize: '0.85rem', display: 'inline-block'
      }}>
        ⏱ {pct}% de ocupación — espera +{resultado.minutos_espera_extra} min (Regla 15).
      </span>
    );
  }
  return (
    <span style={{
      background: '#e8f5e9', color: '#2e7d32', padding: '6px 10px',
      borderRadius: 8, fontSize: '0.85rem', display: 'inline-block'
    }}>
      ✓ {pct}% de ocupación — normal.
    </span>
  );
}
