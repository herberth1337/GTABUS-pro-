const express = require('express');
const router = express.Router();
const c = require('../controllers/usuarioController');

// Todas estas rutas ya están protegidas como "solo admin" en server.js
router.get('/', c.listar);
router.post('/', c.crear);
router.put('/:id/estado', c.cambiarEstado);
router.put('/:id/password', c.cambiarPassword);

module.exports = router;
