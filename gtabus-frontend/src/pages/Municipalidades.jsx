import { useEffect, useRef, useState } from 'react';
import api from '../services/authSetup.js';
import ListPage from '../components/ListPage.jsx';

const vacio = { nombre: '', direccion: '', telefono: '' };

export default function Municipalidades() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState(vacio);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [guardando, setGuardando] = useState(false);
  const formRef = useRef(null);

  function cargar() {
    api.get('/municipalidades').then(res => setLista(res.data));
  }
  useEffect(() => { cargar(); }, []);

  function editar(m) {
    setEditandoId(m.id_municipalidad);
    setForm({ nombre: m.nombre, direccion: m.direccion || '', telefono: m.telefono || '' });
    setError(''); setMensaje('');
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function cancelar() {
    setEditandoId(null);
    setForm(vacio);
    setError('');
  }

  async function guardar(e) {
    e.preventDefault();
    setError(''); setMensaje('');
    setGuardando(true);
    try {
      if (editandoId) {
        await api.put(`/municipalidades/${editandoId}`, form);
        setMensaje('Municipalidad actualizada.');
      } else {
        await api.post('/municipalidades', form);
        setMensaje('Municipalidad creada. Ya puedes elegirla al crear líneas y estaciones.');
      }
      setEditandoId(null);
      setForm(vacio);
      cargar();
    } catch (err) {
      setError(err.response?.data?.error || 'No se pudo guardar la municipalidad.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <ListPage
        title="Municipalidades"
        subtitle="Cada línea y cada estación pertenece a una municipalidad; los buses pertenecen a la de su línea."
        searchPlaceholder="Buscar por nombre o dirección..."
        data={lista}
        searchFn={(m, q) => {
          const t = q.toLowerCase();
          return m.nombre.toLowerCase().includes(t) || (m.direccion || '').toLowerCase().includes(t);
        }}
        columns={['Nombre', 'Dirección', 'Teléfono', 'Líneas', 'Estaciones', '']}
        emptyMessage="Todavía no hay municipalidades."
        renderRow={(m) => (
          <tr key={m.id_municipalidad}>
            <td>{m.nombre}</td>
            <td>{m.direccion || '—'}</td>
            <td className="mono">{m.telefono || '—'}</td>
            <td className="mono">{m.lineas}</td>
            <td className="mono">{m.estaciones}</td>
            <td>
              <button className="btn-ghost" style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                onClick={() => editar(m)}>
                Editar
              </button>
            </td>
          </tr>
        )}
      />

      <div className="card" style={{ marginTop: 16 }} ref={formRef}>
        <h2 style={{ marginTop: 0 }}>{editandoId ? 'Editar municipalidad' : 'Nueva municipalidad'}</h2>
        {error && <p className="alerta">{error}</p>}
        {mensaje && (
          <p style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px 14px', borderRadius: 8, fontSize: '0.9rem' }}>
            {mensaje}
          </p>
        )}
        <form onSubmit={guardar}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 2 }}>
              <label>Nombre</label>
              <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                placeholder="ej. Municipalidad de Mixco" required />
            </div>
            <div style={{ flex: 2 }}>
              <label>Dirección</label>
              <input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} />
            </div>
            <div style={{ flex: 1 }}>
              <label>Teléfono</label>
              <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} />
            </div>
          </div>
          <br />
          <button type="submit" className="btn-accent" disabled={guardando}>
            {guardando ? 'Guardando...' : (editandoId ? 'Guardar cambios' : '+ Crear municipalidad')}
          </button>{' '}
          {editandoId && <button type="button" className="btn-ghost" onClick={cancelar}>Cancelar</button>}
        </form>
      </div>
    </>
  );
}
