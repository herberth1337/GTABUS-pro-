const express = require('express');
const cors = require('cors');
require('dotenv').config();

const lineaRoutes = require('./routes/lineaRoutes');
const estacionRoutes = require('./routes/estacionRoutes');
const busRoutes = require('./routes/busRoutes');
const pilotoRoutes = require('./routes/pilotoRoutes');
const viajeRoutes = require('./routes/viajeRoutes');
const municipalidadRoutes = require('./routes/municipalidadRoutes');
const parqueoRoutes = require('./routes/parqueoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/lineas', lineaRoutes);
app.use('/api/estaciones', estacionRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/pilotos', pilotoRoutes);
app.use('/api/viajes', viajeRoutes);
app.use('/api/municipalidades', municipalidadRoutes);
app.use('/api/parqueos', parqueoRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API GTABUS - Sistema de Control de Transmetro' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor GTABUS escuchando en el puerto ${PORT}`);
});
