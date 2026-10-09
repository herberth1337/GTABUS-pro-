const express = require('express');
const router = express.Router();
const c = require('../controllers/estacionController');

router.get('/', c.getEstaciones);
router.post('/', c.crearEstacion);
router.get('/:id/accesos', c.getAccesosConGuardias);
router.get('/:id/distancia/:id2', c.getDistanciaEntreEstaciones);

module.exports = router;
