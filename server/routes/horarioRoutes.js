const express                  = require('express');
const router                   = express.Router();
const db                       = require('../db'); // 👈 AGREGAR ESTA LÍNEA
const verifyToken              = require('../middleware/verifyToken');
const { getHorario, addClase } = require('../controllers/horarioController');

router.get('/',  verifyToken, getHorario);
router.post('/', verifyToken, addClase);


router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    
    try {
        const [result] = await db.query('DELETE FROM clase WHERE id_clase = ?', [id])
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Clase no encontrada' })
        }
        
        res.json({ mensaje: 'Clase eliminada correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar la clase' })
    }
});


module.exports = router;