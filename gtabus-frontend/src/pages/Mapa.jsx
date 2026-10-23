import { Fragment, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './mapa.css';
import geoData from '../data/transmetro-geo.json';

const CENTRO_GUATEMALA = [14.6255, -90.5225];

const NOMBRES_LINEA = {
  L1: 'Línea 1 · Centro Histórico',
  L2: 'Línea 2 · Hipódromo',
  L6: 'Línea 6 · Eje Norte',
  L7: 'Línea 7',
  L12: 'Línea 12 · Eje Sur',
  L13: 'Línea 13 · Eje Central',
  L18: 'Línea 18 · Eje Nor-oriente',
  R5: 'Ruta 5 (TuBus)',
};

// Leaflet no se entera solo cuando el contenedor cambia de tamaño (al ampliar).
function AjustarTamano({ clave }) {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 200);
    return () => clearTimeout(t);
  }, [clave, map]);
  return null;
}

export default function Mapa() {
  const codigos = useMemo(() => Object.keys(geoData), []);
  const [visibles, setVisibles] = useState(() =>
    Object.fromEntries(codigos.map(c => [c, true]))
  );
  const [ampliado, setAmpliado] = useState(false);

  // Esc cierra el modo ampliado
  useEffect(() => {
    if (!ampliado) return;
    const alTeclear = (e) => { if (e.key === 'Escape') setAmpliado(false); };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [ampliado]);

  function toggle(cod) {
    setVisibles(v => ({ ...v, [cod]: !v[cod] }));
  }
  function todas(valor) {
    setVisibles(Object.fromEntries(codigos.map(c => [c, valor])));
  }

  return (
    <div className="mapa-ancho">
      <div className="list-header">
        <div>
          <h1>Mapa de rutas</h1>
          <p className="subtitle">
            Trazo real de las líneas de Transmetro y TuBus sobre la Ciudad de Guatemala.
          </p>
        </div>
      </div>

      <div className={ampliado ? 'mapa-contenedor mapa-ampliado' : 'mapa-contenedor'}>
        <div className="card mapa-leyenda">
          <button
            className="btn-accent"
            style={{ width: '100%', marginBottom: 12, padding: '7px 10px', fontSize: '0.85rem' }}
            onClick={() => setAmpliado(a => !a)}
          >
            {ampliado ? 'Salir de pantalla completa' : 'Ampliar mapa'}
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <strong style={{ fontSize: '0.85rem' }}>Líneas</strong>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                onClick={() => todas(true)}>Todas</button>
              <button className="btn-ghost" style={{ padding: '2px 8px', fontSize: '0.75rem' }}
                onClick={() => todas(false)}>Ninguna</button>
            </div>
          </div>

          {codigos.map(cod => (
            <label
              key={cod}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 4px', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              <input type="checkbox" checked={visibles[cod]} onChange={() => toggle(cod)} style={{ width: 'auto' }} />
              <span style={{ width: 12, height: 12, borderRadius: 3, flexShrink: 0, background: geoData[cod].color }} />
              <span className="mono" style={{ fontWeight: 600 }}>{cod}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                {NOMBRES_LINEA[cod]?.split('·')[1]?.trim() || ''}
              </span>
            </label>
          ))}

          <p className="helper-text" style={{ marginTop: 14 }}>
            Datos geográficos reales: proyecto abierto{' '}
            <a href="https://github.com/pilyrodriguez0-art/gtfs-guatemala" target="_blank" rel="noreferrer">
              gtfs-guatemala
            </a>{' '}(CC0).
          </p>
        </div>

        <div className="table-wrap mapa-lienzo">
          <MapContainer center={CENTRO_GUATEMALA} zoom={12} style={{ height: '100%', width: '100%' }}>
            <AjustarTamano clave={ampliado} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {codigos.filter(cod => visibles[cod]).map(cod => {
              const linea = geoData[cod];
              return (
                <Fragment key={cod}>
                  {linea.trazos.map((trazo, i) => (
                    <Polyline
                      key={`${cod}-trazo-${i}`}
                      positions={trazo}
                      pathOptions={{ color: linea.color, weight: 4, opacity: 0.85 }}
                    />
                  ))}
                  {linea.paradas.map((p, i) => (
                    <CircleMarker
                      key={`${cod}-parada-${i}`}
                      center={[p.lat, p.lng]}
                      radius={5}
                      pathOptions={{ color: '#10161c', weight: 1.5, fillColor: linea.color, fillOpacity: 1 }}
                    >
                      <Popup>
                        <strong>{p.nombre}</strong><br />
                        <span className="mono">{cod}</span> — parada {p.orden}
                      </Popup>
                    </CircleMarker>
                  ))}
                </Fragment>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
