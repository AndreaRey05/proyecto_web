const express      = require('express')
const router       = express.Router()
const verifyToken  = require('../middleware/verifyToken')
const { getProfesores, eliminarProfesor } = require('../controllers/profesorController')

router.get('/',    verifyToken, getProfesores)
router.delete('/:num_cuenta', verifyToken, eliminarProfesor)

module.exports = router