const express = require('express');
const router = express.Router();
const c = require('../controllers/parqueoController');

router.get('/', c.getParqueos);
router.post('/', c.crearParqueo);

module.exports = router;
