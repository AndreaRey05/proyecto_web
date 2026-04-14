const express                  = require('express');
const router                   = express.Router();
const verifyToken              = require('../middleware/verifyToken');
const { getHorario, addClase } = require('../controllers/horarioController');

router.get('/',  verifyToken, getHorario);
router.post('/', verifyToken, addClase);

module.exports = router;