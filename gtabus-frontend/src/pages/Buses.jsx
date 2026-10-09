import { useEffect, useState } from 'react';
import { BusService } from '../services/api.js';
import ListPage from '../components/ListPage.jsx';

export default function Buses() {
  const [buses, setBuses] = useState([]);

  useEffect(() => {
    BusService.listar().then(res => setBuses(res.data)).catch(console.error);
  }, []);

  return (
    <ListPage
      title="Flota de buses"
      subtitle="Unidades registradas, su línea asignada y parqueo actual."
      actionLabel="+ Nuevo bus"
      actionTo="/buses/nuevo"
      searchPlaceholder="Buscar por placa, línea o parqueo..."
      data={buses}
      searchFn={(b, q) => {
        const t = q.toLowerCase();
        return b.placa.toLowerCase().includes(t) ||
               (b.linea || '').toLowerCase().includes(t) ||
               (b.parqueo_actual || '').toLowerCase().includes(t);
      }}
      columns={['Placa', 'Línea', 'Capacidad', 'Parqueo actual']}
      emptyMessage="Todavía no se ha registrado ningún bus."
      renderRow={(b) => (
        <tr key={b.id_bus}>
          <td className="mono">{b.placa}</td>
          <td>{b.linea ? <span className="badge-linea">{b.linea}</span> : <span className="helper-text">Sin asignar</span>}</td>
          <td>{b.capacidad_maxima}</td>
          <td>{b.parqueo_actual}</td>
        </tr>
      )}
    />
  );
}
