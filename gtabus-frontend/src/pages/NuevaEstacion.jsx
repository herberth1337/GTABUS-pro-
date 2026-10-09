import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EstacionService, MunicipalidadService } from '../services/api.js';

export default function NuevaEstacion() {
  const navigate = useNavigate();
  const [municipalidades, setMunicipalidades] = useState([]);
  const [form, setForm] = useState({
    nombre: '', direccion: '', latitud: '', longitud: '', id_municipalidad: ''
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    MunicipalidadService.listar().then(res => {
      setMunicipalidades(res.data);
      if (res.data.length > 0) {
        setForm(f => ({ ...f, id_municipalidad: res.data[0].id_municipalidad }));
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
      await EstacionService.crear({
        ...form,
        latitud: form.latitud || null,
        longitud: form.longitud || null
      });
      navigate('/estaciones');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al crear la estación.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="card">
      <h2>Nueva estación</h2>
      {error && <p className="alerta">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Dirección</label>
        <input name="direccion" value={form.direccion} onChange={handleChange} />

        <label>Latitud (opcional)</label>
        <input name="latitud" type="number" step="0.000001" value={form.latitud} onChange={handleChange} />

        <label>Longitud (opcional)</label>
        <input name="longitud" type="number" step="0.000001" value={form.longitud} onChange={handleChange} />

        <label>Municipalidad</label>
        <select name="id_municipalidad" value={form.id_municipalidad} onChange={handleChange} required>
          {municipalidades.map(m => (
            <option key={m.id_municipalidad} value={m.id_municipalidad}>{m.nombre}</option>
          ))}
        </select>

        <br /><br />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Crear estación'}
        </button>
      </form>
    </div>
  );
}
