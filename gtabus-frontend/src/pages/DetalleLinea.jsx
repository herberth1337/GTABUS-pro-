import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { LineaService } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function DetalleLinea() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [linea, setLinea] = useState(null);
  const [estaciones, setEstaciones] = useState([]);
  const [accesos, setAccesos] = useState([]);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    LineaService.listar().then(r => setLinea(r.data.find(l => String(l.id_linea) === String(id)) || null));
    LineaService.estaciones(id).then(r => setEstaciones(r.data));
    LineaService.accesos(id).then(r => setAccesos(r.data));
    LineaService.buses(id).then(r => setBuses(r.data));
  }, [id]);

  return (
    <>
      <div className="list-header">
        <div>
          <h1>{linea ? `${linea.codigo} · ${linea.nombre}` : 'Detalle de la línea'}</h1>
          {linea && (
            <p className="subtitle">
              {linea.nombre_municipalidad} — {estaciones.length} estaciones — {Number(linea.distancia_total_km).toLocaleString('es-GT', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} km
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin && <Link to={`/lineas/${id}/ruta`}><button className="btn-accent">Editar ruta y distancias</button></Link>}
          <Link to="/"><button className="btn-ghost">← Volver a líneas</button></Link>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Ruta de la línea (orden de estaciones)</h2>
        <table>
          <thead><tr><th>#</th><th>Estación</th><th>Dist. a la siguiente (km)</th></tr></thead>
          <tbody>
            {estaciones.map(e => (
              <tr key={e.id_estacion}>
                <td>{e.orden}</td>
                <td>{e.nombre}</td>
                <td>{e.distancia_siguiente_km ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Accesos de la línea</h2>
        <table>
          <thead><tr><th>Estación</th><th>Acceso</th></tr></thead>
          <tbody>
            {accesos.map(a => (
              <tr key={a.id_acceso}>
                <td>{a.estacion}</td>
                <td>{a.nombre_acceso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Buses asignados ({buses.length})</h2>
        <table>
          <thead><tr><th>Placa</th><th>Capacidad</th><th>Activo</th></tr></thead>
          <tbody>
            {buses.map(b => (
              <tr key={b.id_bus}>
                <td>{b.placa}</td>
                <td>{b.capacidad_maxima}</td>
                <td>{b.activo ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
