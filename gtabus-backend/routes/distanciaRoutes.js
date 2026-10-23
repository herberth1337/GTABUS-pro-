const express = require('express');
const router = express.Router();
const c = require('../controllers/distanciaController');

// Consulta abierta a cualquier usuario con sesión (ver server.js)
router.get('/', c.calcular);

module.exports = router;
