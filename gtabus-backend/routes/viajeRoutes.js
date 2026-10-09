const express = require('express');
const router = express.Router();
const viajeController = require('../controllers/viajeController');
const busController = require('../controllers/busController');

// Viajes (recorridos)
router.get('/', viajeController.listarViajes);
router.post('/', viajeController.crearViaje);
router.get('/:id/visitas', viajeController.getVisitasDeViaje);

// Visitas a estación dentro de un viaje -> aplica Reglas 14 y 15
router.post('/visitas', busController.registrarVisitaEstacion);

module.exports = router;
