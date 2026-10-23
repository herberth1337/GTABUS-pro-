import { BrowserRouter, Routes, Route, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import Lineas from './pages/Lineas.jsx';
import Estaciones from './pages/Estaciones.jsx';
import DistanciaEstaciones from './pages/DistanciaEstaciones.jsx';
import DetalleEstacion from './pages/DetalleEstacion.jsx';
import Buses from './pages/Buses.jsx';
import Parqueos from './pages/Parqueos.jsx';
import Pilotos from './pages/Pilotos.jsx';
import Mapa from './pages/Mapa.jsx';
import SimularViaje from './pages/SimularViaje.jsx';
import CambiarParqueo from './pages/CambiarParqueo.jsx';
import DetalleLinea from './pages/DetalleLinea.jsx';
import EditarRuta from './pages/EditarRuta.jsx';
import DetallePiloto from './pages/DetallePiloto.jsx';
import NuevaLinea from './pages/NuevaLinea.jsx';
import NuevaEstacion from './pages/NuevaEstacion.jsx';
import NuevoBus from './pages/NuevoBus.jsx';
import NuevoPiloto from './pages/NuevoPiloto.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Municipalidades from './pages/Municipalidades.jsx';
import AsignarPilotos from './pages/AsignarPilotos.jsx';

// admin: true -> solo se muestra (y solo se puede entrar) siendo administrador
const navItems = [
  { to: '/', label: 'Líneas', end: true },
  { to: '/mapa', label: 'Mapa' },
  { to: '/estaciones', label: 'Estaciones' },
  { to: '/distancias', label: 'Distancias' },
  { to: '/municipalidades', label: 'Municipalidades', admin: true },
  { to: '/buses', label: 'Buses' },
  { to: '/parqueos', label: 'Parqueos' },
  { to: '/pilotos', label: 'Pilotos', admin: true },
  { to: '/asignar-pilotos', label: 'Asignar pilotos', admin: true },
  { to: '/simular-viaje', label: 'Simular viaje' },
  { to: '/cambiar-parqueo', label: 'Cambiar parqueo', admin: true },
  { to: '/usuarios', label: 'Usuarios', admin: true },
];

function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
}

function Layout() {
  const { user, isAdmin, logout } = useAuth();
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">GTA</span>
          <span className="brand-name">BUS</span>
        </div>
        <p className="brand-sub">Control de Transmetro</p>
        <nav>
          {navItems.filter(i => !i.admin || isAdmin).map(item => (
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

        <div style={{ marginTop: 28, paddingTop: 16, borderTop: '1px solid var(--ink-line)' }}>
          <div style={{ fontSize: '0.88rem', color: '#f2f2ef', fontWeight: 600 }}>{user.nombre}</div>
          <div style={{ fontSize: '0.78rem', color: '#7c8794', marginBottom: 10 }}>
            {isAdmin ? 'Administrador' : 'Usuario'}
          </div>
          <button
            className="btn-ghost"
            style={{ width: '100%', color: '#f2f2ef', borderColor: 'var(--ink-line)', fontSize: '0.82rem', padding: '7px 10px' }}
            onClick={logout}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<RequireAuth><Layout /></RequireAuth>}>
            <Route path="/" element={<Lineas />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/lineas/:id" element={<DetalleLinea />} />
            <Route path="/estaciones" element={<Estaciones />} />
            <Route path="/estaciones/:id" element={<DetalleEstacion />} />
            <Route path="/distancias" element={<DistanciaEstaciones />} />
            <Route path="/buses" element={<Buses />} />
            <Route path="/parqueos" element={<Parqueos />} />
            <Route path="/simular-viaje" element={<SimularViaje />} />

            {/* Solo administrador */}
            <Route path="/lineas/nueva" element={<RequireAdmin><NuevaLinea /></RequireAdmin>} />
            <Route path="/lineas/:id/ruta" element={<RequireAdmin><EditarRuta /></RequireAdmin>} />
            <Route path="/estaciones/nueva" element={<RequireAdmin><NuevaEstacion /></RequireAdmin>} />
            <Route path="/municipalidades" element={<RequireAdmin><Municipalidades /></RequireAdmin>} />
            <Route path="/buses/nuevo" element={<RequireAdmin><NuevoBus /></RequireAdmin>} />
            <Route path="/pilotos" element={<RequireAdmin><Pilotos /></RequireAdmin>} />
            <Route path="/pilotos/nuevo" element={<RequireAdmin><NuevoPiloto /></RequireAdmin>} />
            <Route path="/pilotos/:id" element={<RequireAdmin><DetallePiloto /></RequireAdmin>} />
            <Route path="/asignar-pilotos" element={<RequireAdmin><AsignarPilotos /></RequireAdmin>} />
            <Route path="/cambiar-parqueo" element={<RequireAdmin><CambiarParqueo /></RequireAdmin>} />
            <Route path="/usuarios" element={<RequireAdmin><Usuarios /></RequireAdmin>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
