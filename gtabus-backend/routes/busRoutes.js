const express = require('express');
const router = express.Router();
const c = require('../controllers/busController');

router.get('/', c.getBuses);
router.post('/', c.crearBus);
router.put('/:id/parqueo', c.cambiarParqueo);
router.get('/:id/historial-parqueo', c.getHistorialParqueo);

module.exports = router;
