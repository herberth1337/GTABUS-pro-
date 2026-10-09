import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BusService, LineaService, ParqueoService } from '../services/api.js';

export default function NuevoBus() {
  const navigate = useNavigate();
  const [lineas, setLineas] = useState([]);
  const [parqueos, setParqueos] = useState([]);
  const [form, setForm] = useState({
    placa: '', capacidad_maxima: 100, id_linea: '', id_parqueo_actual: ''
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    LineaService.listar().then(res => setLineas(res.data));
    ParqueoService.listar().then(res => {
      setParqueos(res.data);
      if (res.data.length > 0) {
        setForm(f => ({ ...f, id_parqueo_actual: res.data[0].id_parqueo }));
      }
    });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await BusService.crear({
        ...form,
        id_linea: form.id_linea || null
      });
      navigate('/buses');
    } catch (err) {
      // El backend puede rechazar por el trigger de la Regla 5 (máximo de buses por línea)
      setError(err.response?.data?.error || 'Ocurrió un error al crear el bus.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="card">
      <h2>Nuevo bus</h2>
      {error && <p className="alerta">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Placa</label>
        <input name="placa" value={form.placa} onChange={handleChange} required placeholder="ej. L1-011" />

        <label>Capacidad máxima de pasajeros</label>
        <input name="capacidad_maxima" type="number" min="1" value={form.capacidad_maxima} onChange={handleChange} required />

        <label>Línea (opcional — puede quedar sin asignar)</label>
        <select name="id_linea" value={form.id_linea} onChange={handleChange}>
          <option value="">Sin asignar</option>
          {lineas.map(l => (
            <option key={l.id_linea} value={l.id_linea}>{l.codigo} — {l.nombre}</option>
          ))}
        </select>

        <label>Parqueo asignado (obligatorio)</label>
        <select name="id_parqueo_actual" value={form.id_parqueo_actual} onChange={handleChange} required>
          {parqueos.map(p => (
            <option key={p.id_parqueo} value={p.id_parqueo}>{p.nombre} ({p.nombre_estacion})</option>
          ))}
        </select>

        <br /><br />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Crear bus'}
        </button>
      </form>
    </div>
  );
}
