import { useEffect, useState } from 'react';
import { EstacionService } from '../services/api.js';
import ListPage from '../components/ListPage.jsx';

export default function Estaciones() {
  const [estaciones, setEstaciones] = useState([]);

  useEffect(() => {
    EstacionService.listar().then(res => setEstaciones(res.data)).catch(console.error);
  }, []);

  return (
    <ListPage
      title="Estaciones"
      subtitle="Todas las paradas del sistema, con su dirección y municipalidad."
      actionLabel="+ Nueva estación"
      actionTo="/estaciones/nueva"
      searchPlaceholder="Buscar por nombre, dirección o municipalidad..."
      data={estaciones}
      searchFn={(e, q) => {
        const t = q.toLowerCase();
        return e.nombre.toLowerCase().includes(t) ||
               (e.direccion || '').toLowerCase().includes(t) ||
               (e.nombre_municipalidad || '').toLowerCase().includes(t);
      }}
      columns={['Nombre', 'Dirección', 'Municipalidad']}
      emptyMessage="Todavía no se ha registrado ninguna estación."
      renderRow={(e) => (
        <tr key={e.id_estacion}>
          <td>{e.nombre}</td>
          <td>{e.direccion}</td>
          <td>{e.nombre_municipalidad}</td>
        </tr>
      )}
    />
  );
}
