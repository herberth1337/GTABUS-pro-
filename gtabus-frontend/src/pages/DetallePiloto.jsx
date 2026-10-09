import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PilotoService } from '../services/api.js';

export default function DetallePiloto() {
  const { id } = useParams();
  const [piloto, setPiloto] = useState(null);
  const [error, setError] = useState('');

  function cargar() {
    PilotoService.obtener(id).then(res => setPiloto(res.data)).catch(() => {
      setError('No se pudo cargar la información del piloto.');
    });
  }

  useEffect(() => { cargar(); }, [id]);

  if (error) return <p className="alerta">{error}</p>;
  if (!piloto) return <p className="helper-text">Cargando...</p>;

  return (
    <>
      <div className="list-header">
        <div>
          <h1>{piloto.nombres} {piloto.apellidos}</h1>
          <p className="subtitle">
            DPI <span className="mono">{piloto.dpi}</span> — Licencia tipo {piloto.licencia_tipo}
          </p>
        </div>
        <Link to="/pilotos"><button className="btn-ghost">← Volver a pilotos</button></Link>
      </div>

      <ResidenciaSection piloto={piloto} onGuardado={cargar} />
      <ComunicacionSection piloto={piloto} onAgregado={cargar} />
      <HistorialEducativoSection piloto={piloto} onAgregado={cargar} />
    </>
  );
}

function ResidenciaSection({ piloto, onGuardado }) {
  const [editando, setEditando] = useState(!piloto.residencia);
  const [form, setForm] = useState({
    direccion: piloto.residencia?.direccion || '',
    municipio: piloto.residencia?.municipio || '',
    departamento: piloto.residencia?.departamento || ''
  });
  const [guardando, setGuardando] = useState(false);

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await PilotoService.guardarResidencia(piloto.id_piloto, form);
      setEditando(false);
      onGuardado();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Residencia</h2>
        {!editando && (
          <button className="btn-ghost" onClick={() => setEditando(true)}>
            {piloto.residencia ? 'Editar' : '+ Agregar'}
          </button>
        )}
      </div>

      {!editando ? (
        piloto.residencia ? (
          <p style={{ marginTop: 12 }}>
            {piloto.residencia.direccion}, {piloto.residencia.municipio}, {piloto.residencia.departamento}
          </p>
        ) : (
          <p className="helper-text" style={{ marginTop: 12 }}>Todavía no se ha registrado.</p>
        )
      ) : (
        <form onSubmit={guardar}>
          <label>Dirección</label>
          <input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} required />

          <label>Municipio</label>
          <input value={form.municipio} onChange={e => setForm({ ...form, municipio: e.target.value })} required />

          <label>Departamento</label>
          <input value={form.departamento} onChange={e => setForm({ ...form, departamento: e.target.value })} required />

          <br /><br />
          <button type="submit" className="btn-accent" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar residencia'}
          </button>{' '}
          {piloto.residencia && (
            <button type="button" className="btn-ghost" onClick={() => setEditando(false)}>Cancelar</button>
          )}
        </form>
      )}
    </div>
  );
}

function ComunicacionSection({ piloto, onAgregado }) {
  const [form, setForm] = useState({ tipo: 'telefono', valor: '' });
  const [guardando, setGuardando] = useState(false);

  async function agregar(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await PilotoService.agregarComunicacion(piloto.id_piloto, form);
      setForm({ tipo: 'telefono', valor: '' });
      onAgregado();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Datos de comunicación</h2>

      {piloto.comunicacion.length === 0 ? (
        <p className="helper-text">Todavía no se ha registrado ningún contacto.</p>
      ) : (
        <table style={{ marginBottom: 14 }}>
          <thead><tr><th>Tipo</th><th>Valor</th></tr></thead>
          <tbody>
            {piloto.comunicacion.map(c => (
              <tr key={c.id_comunicacion}>
                <td style={{ textTransform: 'capitalize' }}>{c.tipo}</td>
                <td>{c.valor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={agregar} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <div style={{ width: 160 }}>
          <label>Tipo</label>
          <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })}>
            <option value="telefono">Teléfono</option>
            <option value="correo">Correo</option>
            <option value="emergencia">Contacto de emergencia</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label>Valor</label>
          <input value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} required />
        </div>
        <button type="submit" className="btn-accent" disabled={guardando} style={{ marginBottom: 0 }}>
          {guardando ? 'Agregando...' : '+ Agregar'}
        </button>
      </form>
    </div>
  );
}

function HistorialEducativoSection({ piloto, onAgregado }) {
  const [form, setForm] = useState({ nivel: '', institucion: '', anio_finalizacion: '', titulo_obtenido: '' });
  const [guardando, setGuardando] = useState(false);

  async function agregar(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await PilotoService.agregarHistorialEducativo(piloto.id_piloto, form);
      setForm({ nivel: '', institucion: '', anio_finalizacion: '', titulo_obtenido: '' });
      onAgregado();
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Historial educativo</h2>

      {piloto.historial_educativo.length === 0 ? (
        <p className="helper-text">Todavía no se ha registrado ningún nivel educativo.</p>
      ) : (
        <table style={{ marginBottom: 14 }}>
          <thead><tr><th>Nivel</th><th>Institución</th><th>Año</th><th>Título</th></tr></thead>
          <tbody>
            {piloto.historial_educativo.map(h => (
              <tr key={h.id_historial_edu}>
                <td>{h.nivel}</td>
                <td>{h.institucion}</td>
                <td>{h.anio_finalizacion || '—'}</td>
                <td>{h.titulo_obtenido || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <form onSubmit={agregar}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Nivel</label>
            <input
              value={form.nivel}
              onChange={e => setForm({ ...form, nivel: e.target.value })}
              placeholder="ej. Diversificado"
              required
            />
          </div>
          <div style={{ flex: 2 }}>
            <label>Institución</label>
            <input
              value={form.institucion}
              onChange={e => setForm({ ...form, institucion: e.target.value })}
              required
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label>Año de finalización</label>
            <input
              type="number"
              value={form.anio_finalizacion}
              onChange={e => setForm({ ...form, anio_finalizacion: e.target.value })}
            />
          </div>
          <div style={{ flex: 2 }}>
            <label>Título obtenido</label>
            <input
              value={form.titulo_obtenido}
              onChange={e => setForm({ ...form, titulo_obtenido: e.target.value })}
            />
          </div>
        </div>
        <br />
        <button type="submit" className="btn-accent" disabled={guardando}>
          {guardando ? 'Agregando...' : '+ Agregar nivel educativo'}
        </button>
      </form>
    </div>
  );
}
