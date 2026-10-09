import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PilotoService } from '../services/api.js';

export default function NuevoPiloto() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombres: '', apellidos: '', dpi: '', fecha_nacimiento: '', licencia_tipo: 'A'
  });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await PilotoService.crear(form);
      navigate('/pilotos');
    } catch (err) {
      setError(err.response?.data?.error || 'Ocurrió un error al crear el piloto.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="card">
      <h2>Nuevo piloto</h2>
      <p style={{ color: '#6b7280', fontSize: '0.9em' }}>
        Aquí se captura solo la información básica. El historial educativo, la
        residencia y los datos de comunicación (Regla 9) se agregan después,
        desde el detalle del piloto.
      </p>
      {error && <p className="alerta">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Nombres</label>
        <input name="nombres" value={form.nombres} onChange={handleChange} required />

        <label>Apellidos</label>
        <input name="apellidos" value={form.apellidos} onChange={handleChange} required />

        <label>DPI</label>
        <input name="dpi" value={form.dpi} onChange={handleChange} required maxLength={13} />

        <label>Fecha de nacimiento</label>
        <input name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} />

        <label>Tipo de licencia</label>
        <select name="licencia_tipo" value={form.licencia_tipo} onChange={handleChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="M">M</option>
        </select>

        <br /><br />
        <button type="submit" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Crear piloto'}
        </button>
      </form>
    </div>
  );
}
