import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Lineas from './pages/Lineas.jsx';
import Estaciones from './pages/Estaciones.jsx';
import Buses from './pages/Buses.jsx';
import Pilotos from './pages/Pilotos.jsx';
import Mapa from './pages/Mapa.jsx';
import SimularViaje from './pages/SimularViaje.jsx';
import CambiarParqueo from './pages/CambiarParqueo.jsx';
import DetallePiloto from './pages/DetallePiloto.jsx';
import DetalleLinea from './pages/DetalleLinea.jsx';
import NuevaLinea from './pages/NuevaLinea.jsx';
import NuevaEstacion from './pages/NuevaEstacion.jsx';
import NuevoBus from './pages/NuevoBus.jsx';
import NuevoPiloto from './pages/NuevoPiloto.jsx';

const navItems = [
  { to: '/', label: 'Líneas', end: true },
  { to: '/mapa', label: 'Mapa' },
  { to: '/estaciones', label: 'Estaciones' },
  { to: '/buses', label: 'Buses' },
  { to: '/pilotos', label: 'Pilotos' },
  { to: '/simular-viaje', label: 'Simular viaje' },
  { to: '/cambiar-parqueo', label: 'Cambiar parqueo' },
];

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brand-mark">TU</span>
            <span className="brand-name">BUS</span>
          </div>
          <p className="brand-sub">Control de Transmetro</p>
          <nav>
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <div className="content">
          <Routes>
            <Route path="/" element={<Lineas />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/lineas/nueva" element={<NuevaLinea />} />
            <Route path="/lineas/:id" element={<DetalleLinea />} />

            <Route path="/estaciones" element={<Estaciones />} />
            <Route path="/estaciones/nueva" element={<NuevaEstacion />} />

            <Route path="/buses" element={<Buses />} />
            <Route path="/buses/nuevo" element={<NuevoBus />} />

            <Route path="/pilotos" element={<Pilotos />} />
            <Route path="/pilotos/nuevo" element={<NuevoPiloto />} />
            <Route path="/pilotos/:id" element={<DetallePiloto />} />

            <Route path="/simular-viaje" element={<SimularViaje />} />
            <Route path="/cambiar-parqueo" element={<CambiarParqueo />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
