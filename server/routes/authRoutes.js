const express = require('express');
const router  = express.Router();

const { 
    login, 
    registro, 
    registroAlumno, 
    registroAdmin  
} = require('../controllers/authController'); 
// Rutas
router.post('/login', login);
router.post('/registro', registro);
router.post('/registro-alumno', registroAlumno);
router.post('/registro-admin', registroAdmin); 

// routes/horarioRoutes.js
router.delete('/horario/:id', async (req, res) => {
    const { id } = req.params
    
    try {
        await db.query('DELETE FROM clase WHERE id_clase = ?', [id])
        res.json({ mensaje: 'Clase eliminada correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar la clase' })
    }
})

module.exports = router;