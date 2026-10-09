import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PilotoService } from '../services/api.js';
import ListPage from '../components/ListPage.jsx';

export default function Pilotos() {
  const [pilotos, setPilotos] = useState([]);

  useEffect(() => {
    PilotoService.listar().then(res => setPilotos(res.data)).catch(console.error);
  }, []);

  return (
    <ListPage
      title="Pilotos"
      subtitle="Conductores registrados y su tipo de licencia."
      actionLabel="+ Nuevo piloto"
      actionTo="/pilotos/nuevo"
      searchPlaceholder="Buscar por nombre, apellido o DPI..."
      data={pilotos}
      searchFn={(p, q) => {
        const t = q.toLowerCase();
        return p.nombres.toLowerCase().includes(t) ||
               p.apellidos.toLowerCase().includes(t) ||
               p.dpi.toLowerCase().includes(t);
      }}
      columns={['Nombres', 'Apellidos', 'DPI', 'Licencia', '']}
      emptyMessage="Todavía no se ha registrado ningún piloto."
      renderRow={(p) => (
        <tr key={p.id_piloto}>
          <td>{p.nombres}</td>
          <td>{p.apellidos}</td>
          <td className="mono">{p.dpi}</td>
          <td>{p.licencia_tipo}</td>
          <td><Link to={`/pilotos/${p.id_piloto}`}>Ver detalle</Link></td>
        </tr>
      )}
    />
  );
}
