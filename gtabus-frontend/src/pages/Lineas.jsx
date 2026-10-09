import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineaService } from '../services/api.js';
import ListPage from '../components/ListPage.jsx';

export default function Lineas() {
  const [lineas, setLineas] = useState([]);

  useEffect(() => {
    LineaService.listar().then(res => setLineas(res.data)).catch(console.error);
  }, []);

  return (
    <ListPage
      title="Líneas de Transmetro"
      subtitle="Rutas activas del sistema, con su municipalidad y distancia total."
      actionLabel="+ Nueva línea"
      actionTo="/lineas/nueva"
      searchPlaceholder="Buscar por código, nombre o municipalidad..."
      data={lineas}
      searchFn={(l, q) => {
        const t = q.toLowerCase();
        return l.codigo.toLowerCase().includes(t) ||
               l.nombre.toLowerCase().includes(t) ||
               (l.nombre_municipalidad || '').toLowerCase().includes(t);
      }}
      columns={['Código', 'Nombre', 'Municipalidad', 'Distancia (km)', '']}
      emptyMessage="Todavía no se ha registrado ninguna línea."
      renderRow={(l) => (
        <tr key={l.id_linea}>
          <td><span className="badge-linea">{l.codigo}</span></td>
          <td>{l.nombre}</td>
          <td>{l.nombre_municipalidad}</td>
          <td className="mono">{l.distancia_total_km}</td>
          <td><Link to={`/lineas/${l.id_linea}`}>Ver detalle</Link></td>
        </tr>
      )}
    />
  );
}
