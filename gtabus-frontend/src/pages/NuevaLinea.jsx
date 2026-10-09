import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineaService, MunicipalidadService } from '../services/api.js';

export default function NuevaLinea() {
  const navigate = useNavigate();
  const [municipalidades, setMunicipalidades] = useState([]);
  const [form, setForm] = useState({ nombre: '', codigo: '', color: '', id_municipalidad: '' });
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
      await LineaService.crear(form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al crear la línea.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="card">
      <h2>Nueva línea</h2>
      {error && <p className="alerta">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required />

        <label>Código (ej. L1, L12, R5)</label>
        <input name="codigo" value={form.codigo} onChange={handleChange} required />

        <label>Color</label>
        <input name="color" value={form.color} onChange={handleChange} placeholder="ej. Rojo" />

        <label>Municipalidad</label>
        <select name="id_municipalidad" value={form.id_municipalidad} onChange={handleChange} required>
          {municipalidades.map(m => (
            <option key={m.id_municipalidad} value={m.id_municipalidad}>{m.nombre}</option>
          ))}
        </select>

        <br /><br />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Crear línea'}
        </button>
      </form>
    </div>
  );
}
