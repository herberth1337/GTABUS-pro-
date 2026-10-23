const express = require('express');
const router = express.Router();
const c = require('../controllers/rutaController');

// Se monta en /api/lineas (después de lineaRoutes). Solo administrador: ver server.js
router.put('/:id/ruta/:idEstacion/distancia', c.cambiarDistancia);
router.post('/:id/ruta/estaciones', c.agregarEstacion);

module.exports = router;
