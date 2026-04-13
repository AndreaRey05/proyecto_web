const express        = require('express');
const router         = express.Router();
const verifyToken    = require('../middleware/verifyToken');
const { getHorario } = require('../controllers/horarioController');

// verifyToken protege la ruta — solo usuarios con sesión pueden verla
router.get('/', verifyToken, getHorario);

module.exports = router;