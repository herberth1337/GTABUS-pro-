const express = require('express');
const router = express.Router();
const c = require('../controllers/pilotoController');

router.get('/', c.getPilotos);
router.post('/', c.crearPiloto);
router.get('/:id', c.getPilotoCompleto);

router.put('/:id/residencia', c.upsertResidencia);
router.post('/:id/comunicacion', c.agregarComunicacion);
router.post('/:id/historial-educativo', c.agregarHistorialEducativo);

module.exports = router;
