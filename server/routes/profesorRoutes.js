const express      = require('express')
const router       = express.Router()
const verifyToken  = require('../middleware/verifyToken')
const { 
    getProfesores, 
    eliminarProfesor,
    getHorasLibres,
    addHoraLibre,
    deleteHoraLibre
} = require('../controllers/profesorController')

router.get('/',                          verifyToken, getProfesores)
router.delete('/:num_cuenta',            verifyToken, eliminarProfesor)
router.get('/:num_cuenta/horas-libres',  verifyToken, getHorasLibres)
router.post('/:num_cuenta/horas-libres', verifyToken, addHoraLibre)
router.delete('/horas-libres/:id_hora_libre', verifyToken, deleteHoraLibre)
// routes/profesorRoutes.js
router.get('/profesores/:num_cuenta/materias', async (req, res) => {
    const { num_cuenta } = req.params
    
    try {
        const [materias] = await db.query(`
            SELECT DISTINCT m.id_materia, m.nombre 
            FROM materia m
            JOIN clase c ON c.id_materia = m.id_materia
            WHERE c.id_profesor = ?
        `, [num_cuenta])
        
        res.json(materias)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener materias' })
    }
})

module.exports = router