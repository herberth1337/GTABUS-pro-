const express = require('express');
const router = express.Router();
const c = require('../controllers/lineaController');

router.get('/', c.getLineas);
router.post('/', c.crearLinea);
router.get('/:id/estaciones', c.getEstacionesDeLinea);
router.post('/:id/estaciones', c.agregarEstacionARuta);
router.get('/:id/accesos', c.getAccesosDeLinea);
router.get('/:id/buses', c.getBusesDeLinea);

module.exports = router;
