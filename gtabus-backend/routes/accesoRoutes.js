const express = require('express');
const router = express.Router();
const c = require('../controllers/accesoController');

// Se monta en /api/estaciones (después de estacionRoutes, ver server.js)
router.get('/:id', c.getEstacion);
router.post('/:id/accesos', c.crearAcceso);
router.post('/:id/accesos/:idAcceso/guardias', c.agregarGuardia);

module.exports = router;
