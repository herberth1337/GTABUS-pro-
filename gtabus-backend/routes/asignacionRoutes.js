const express = require('express');
const router = express.Router();
const c = require('../controllers/asignacionController');

// Todo esto es solo para administradores (ver server.js)
router.get('/', c.listar);
router.post('/', c.crear);
router.delete('/:id', c.eliminar);

module.exports = router;
