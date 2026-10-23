const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { verifyToken, requireAdmin } = require('./middlewares/auth');

const lineaRoutes = require('./routes/lineaRoutes');
const rutaRoutes = require('./routes/rutaRoutes');
const estacionRoutes = require('./routes/estacionRoutes');
const accesoRoutes = require('./routes/accesoRoutes');
const busRoutes = require('./routes/busRoutes');
const pilotoRoutes = require('./routes/pilotoRoutes');
const asignacionRoutes = require('./routes/asignacionRoutes');
const distanciaRoutes = require('./routes/distanciaRoutes');
const viajeRoutes = require('./routes/viajeRoutes');
const municipalidadRoutes = require('./routes/municipalidadRoutes');
const parqueoRoutes = require('./routes/parqueoRoutes');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

if (!process.env.JWT_SECRET) {
  console.warn('ADVERTENCIA: JWT_SECRET no está definido; el login no va a funcionar.');
}

const app = express();
app.use(cors());
app.use(express.json());

// Cualquier usuario con sesión puede CONSULTAR (GET); solo el admin puede
// crear o modificar (POST, PUT, DELETE).
const soloAdminEscritura = (req, res, next) =>
  req.method === 'GET' ? next() : requireAdmin(req, res, next);

// Pilotos: datos personales -> todo es solo admin, salvo la lista básica (GET /),
// que necesita el usuario normal para elegir piloto al simular un viaje.
const pilotosAcceso = (req, res, next) =>
  (req.method === 'GET' && req.path === '/') ? next() : requireAdmin(req, res, next);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API GTABUS - Sistema de Control de Transmetro' });
});

app.use('/api/auth', authRoutes);                                      // login público
app.use('/api/usuarios', verifyToken, requireAdmin, usuarioRoutes);    // solo admin

app.use('/api/lineas', verifyToken, soloAdminEscritura, lineaRoutes);
app.use('/api/lineas', verifyToken, soloAdminEscritura, rutaRoutes);          // NUEVO: editar la ruta (solo admin)
app.use('/api/estaciones', verifyToken, soloAdminEscritura, estacionRoutes);
app.use('/api/estaciones', verifyToken, soloAdminEscritura, accesoRoutes);   // accesos y guardias
app.use('/api/buses', verifyToken, soloAdminEscritura, busRoutes);
app.use('/api/municipalidades', verifyToken, soloAdminEscritura, municipalidadRoutes);
app.use('/api/parqueos', verifyToken, soloAdminEscritura, parqueoRoutes);
app.use('/api/pilotos', verifyToken, pilotosAcceso, pilotoRoutes);
app.use('/api/asignaciones', verifyToken, requireAdmin, asignacionRoutes);   // solo admin
app.use('/api/distancias', verifyToken, distanciaRoutes);                    // NUEVO: consulta para todos

// Viajes: el usuario normal también puede iniciar viajes y registrar visitas.
app.use('/api/viajes', verifyToken, viajeRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor GTABUS escuchando en el puerto ${PORT}`);
});
