import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LineaService } from '../services/api.js';

export default function DetalleLinea() {
  const { id } = useParams();
  const [estaciones, setEstaciones] = useState([]);
  const [accesos, setAccesos] = useState([]);
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    LineaService.estaciones(id).then(r => setEstaciones(r.data));
    LineaService.accesos(id).then(r => setAccesos(r.data));
    LineaService.buses(id).then(r => setBuses(r.data));
  }, [id]);

  return (
    <>
      <div className="card">
        <h2>Ruta de la línea (orden de estaciones)</h2>
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
        <h2>Accesos de la línea</h2>
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
        <h2>Buses asignados ({buses.length})</h2>
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
