import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AccesosService } from '../services/accesosService.js';
import { useAuth } from '../context/AuthContext.jsx';

const vacioGuardia = { nombre: '', dpi: '', telefono: '' };

export default function DetalleEstacion() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [estacion, setEstacion] = useState(null);
  const [filas, setFilas] = useState([]);
  const [error, setError] = useState('');

  function cargar() {
    AccesosService.estacion(id)
      .then(res => setEstacion(res.data))
      .catch(() => setError('No se pudo cargar la estación.'));
    AccesosService.accesos(id).then(res => setFilas(res.data));
  }
  useEffect(() => { cargar(); }, [id]);

  if (error) return <p className="alerta">{error}</p>;
  if (!estacion) return <p className="helper-text">Cargando...</p>;

  // El backend devuelve una fila por guardia (o una con guardia nulo si el
  // acceso no tiene). Se agrupa por acceso.
  const mapa = new Map();
  filas.forEach(f => {
    if (!mapa.has(f.id_acceso)) {
      mapa.set(f.id_acceso, { id_acceso: f.id_acceso, nombre: f.acceso, guardias: [] });
    }
    if (f.id_guardia) {
      mapa.get(f.id_acceso).guardias.push({
        id_guardia: f.id_guardia, nombre: f.guardia, telefono: f.telefono
      });
    }
  });
  const accesos = Array.from(mapa.values());

  return (
    <>
      <div className="list-header">
        <div>
          <h1>{estacion.nombre}</h1>
          <p className="subtitle">{estacion.direccion} — {estacion.nombre_municipalidad}</p>
        </div>
        <Link to="/estaciones"><button className="btn-ghost">← Volver a estaciones</button></Link>
      </div>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Accesos y guardias ({accesos.length})</h2>
        <p className="helper-text" style={{ marginTop: -8 }}>
          Cada acceso pertenece a una sola estación y debe tener al menos un guardia.
        </p>

        {accesos.length === 0 ? (
          <p className="helper-text">Esta estación todavía no tiene accesos registrados.</p>
        ) : (
          accesos.map(a => (
            <AccesoCard key={a.id_acceso} acceso={a} idEstacion={id} puedeEditar={isAdmin} onCambio={cargar} />
          ))
        )}
      </div>

      {isAdmin && <NuevoAcceso idEstacion={id} onCreado={cargar} />}
    </>
  );
}

function AccesoCard({ acceso, idEstacion, puedeEditar, onCambio }) {
  const [abierto, setAbierto] = useState(false);
  const [form, setForm] = useState(vacioGuardia);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function agregar(e) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await AccesosService.agregarGuardia(idEstacion, acceso.id_acceso, form);
      setForm(vacioGuardia);
      setAbierto(false);
      onCambio();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo agregar el guardia.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 8, padding: 14, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{acceso.nombre}</strong>
        {puedeEditar && (
          <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }}
            onClick={() => setAbierto(a => !a)}>
            + Guardia
          </button>
        )}
      </div>

      {acceso.guardias.length === 0 ? (
        <p className="helper-text" style={{ margin: '8px 0 0' }}>⚠️ Este acceso no tiene guardia asignado.</p>
      ) : (
        <ul style={{ margin: '8px 0 0', paddingLeft: 18 }}>
          {acceso.guardias.map(g => (
            <li key={g.id_guardia} style={{ fontSize: '0.9rem' }}>
              {g.nombre} {g.telefono && <span className="helper-text">— {g.telefono}</span>}
            </li>
          ))}
        </ul>
      )}

      {abierto && (
        <form onSubmit={agregar} style={{ marginTop: 10 }}>
          {error && <p className="alerta">{error}</p>}
          <FormGuardia form={form} setForm={setForm} />
          <button type="submit" className="btn-accent" disabled={guardando} style={{ marginTop: 10 }}>
            {guardando ? 'Agregando...' : 'Agregar guardia'}
          </button>
        </form>
      )}
    </div>
  );
}

function NuevoAcceso({ idEstacion, onCreado }) {
  const [nombre, setNombre] = useState('');
  const [guardia, setGuardia] = useState(vacioGuardia);
  const [error, setError] = useState('');
  const [guardando, setGuardando] = useState(false);

  async function crear(e) {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      await AccesosService.crearAcceso(idEstacion, { nombre, guardia });
      setNombre('');
      setGuardia(vacioGuardia);
      onCreado();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo crear el acceso.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0 }}>Agregar acceso</h2>
      <p className="helper-text" style={{ marginTop: -8 }}>
        Un acceso se crea junto con su primer guardia (Regla 10).
      </p>
      {error && <p className="alerta">{error}</p>}
      <form onSubmit={crear}>
        <label>Nombre del acceso</label>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="ej. Acceso Oriente" required />
        <label style={{ marginTop: 18 }}>Primer guardia</label>
        <FormGuardia form={guardia} setForm={setGuardia} />
        <br />
        <button type="submit" className="btn-accent" disabled={guardando}>
          {guardando ? 'Creando...' : '+ Crear acceso'}
        </button>
      </form>
    </div>
  );
}

function FormGuardia({ form, setForm }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <input style={{ flex: 2 }} placeholder="Nombre" value={form.nombre}
        onChange={e => setForm({ ...form, nombre: e.target.value })} required />
      <input style={{ flex: 1 }} placeholder="DPI" value={form.dpi}
        onChange={e => setForm({ ...form, dpi: e.target.value })} required />
      <input style={{ flex: 1 }} placeholder="Teléfono" value={form.telefono}
        onChange={e => setForm({ ...form, telefono: e.target.value })} />
    </div>
  );
}
