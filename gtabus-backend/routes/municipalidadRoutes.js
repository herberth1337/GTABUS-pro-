const express = require('express');
const router = express.Router();
const c = require('../controllers/municipalidadController');

// Las escrituras (POST/PUT) ya quedan limitadas al admin en server.js
router.get('/', c.getMunicipalidades);
router.post('/', c.crearMunicipalidad);
router.put('/:id', c.actualizarMunicipalidad);

module.exports = router;
