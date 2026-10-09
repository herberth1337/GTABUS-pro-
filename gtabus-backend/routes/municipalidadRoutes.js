const express = require('express');
const router = express.Router();
const c = require('../controllers/municipalidadController');

router.get('/', c.getMunicipalidades);

module.exports = router;
