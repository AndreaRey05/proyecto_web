const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const bcrypt      = require('bcrypt')
const db          = require('../db')

// GET todos los grupos
router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT g.*, p.nombre AS nombre_tutor
            FROM grupo g
            LEFT JOIN profesor p ON p.id_grupo_tutorado = g.id_grupo
        `)
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener grupos' })
    }
})

// GET clases en curso ahora mismo (para profesores y alumnos)
router.get('/en-curso', verifyToken, async (req, res) => {
    try {
        const ahora = new Date()
        const dia = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'][ahora.getDay()]
        const hora = ahora.toTimeString().slice(0, 8) // HH:MM:SS

        const [rows] = await db.query(`
            SELECT c.*, 
                   g.nombre AS grupo, 
                   m.nombre AS materia, 
                   s.nombre AS salon,
                   p.nombre AS profesor
            FROM clase c
            JOIN grupo   g ON g.id_grupo   = c.id_grupo
            JOIN materia m ON m.id_materia = c.id_materia
            JOIN salon   s ON s.id_salon   = c.id_salon
            JOIN profesor p ON p.num_cuenta = c.id_profesor
            WHERE c.dia = ? AND ? BETWEEN c.hora_inicio AND c.hora_fin
        `, [dia, hora])
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener clases en curso' })
    }
})

// PUT editar grupo (solo admin)
router.put('/:id', verifyToken, async (req, res) => {
    if (req.user.rol !== 'administrador')
        return res.status(403).json({ error: 'Sin permisos' })

    const { nombre, semestre } = req.body
    try {
        await db.query(
            'UPDATE grupo SET nombre = ?, semestre = ? WHERE id_grupo = ?',
            [nombre, semestre, req.params.id]
        )
        res.json({ mensaje: 'Grupo actualizado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar grupo' })
    }
})

// POST crear grupo (solo admin)
router.post('/', verifyToken, async (req, res) => {
    if (req.user.rol !== 'administrador')
        return res.status(403).json({ error: 'Sin permisos' })

    const { nombre, semestre } = req.body
    if (!nombre || !semestre)
        return res.status(400).json({ error: 'Nombre y semestre son requeridos' })

    try {
        const [result] = await db.query(
            'INSERT INTO grupo (nombre, semestre) VALUES (?, ?)',
            [nombre, semestre]
        )
        res.json({ id_grupo: result.insertId, nombre, semestre })
    } catch (error) {
        res.status(500).json({ error: 'Error al crear grupo' })
    }
})



// PUT asignar tutor a grupo (solo admin)
router.put('/:id/tutor', verifyToken, async (req, res) => {
    if (req.user.rol !== 'administrador')
        return res.status(403).json({ error: 'Sin permisos' })

    const { num_cuenta_profesor } = req.body
    try {
        // Quitar grupo tutorado anterior de ese profesor si tenía
        await db.query(
            'UPDATE profesor SET id_grupo_tutorado = NULL WHERE id_grupo_tutorado = ?',
            [req.params.id]
        )
        if (num_cuenta_profesor) {
            await db.query(
                'UPDATE profesor SET id_grupo_tutorado = ? WHERE num_cuenta = ?',
                [req.params.id, num_cuenta_profesor]
            )
        }
        res.json({ mensaje: 'Tutor asignado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al asignar tutor' })
    }
})

// DELETE eliminar grupo (solo admin, requiere contraseña)
router.delete('/:id', verifyToken, async (req, res) => {
    if (req.user.rol !== 'administrador')
        return res.status(403).json({ error: 'Sin permisos' })

    const { contrasena } = req.body
    try {
        const [admins] = await db.query(
            'SELECT * FROM administrador WHERE num_administrador = ?', [req.user.num_cuenta]
        )
        if (!admins.length)
            return res.status(404).json({ error: 'Administrador no encontrado' })

        const valida = await bcrypt.compare(contrasena, admins[0].contra)
        if (!valida)
            return res.status(401).json({ error: 'Contraseña incorrecta' })

        await db.query('DELETE FROM grupo WHERE id_grupo = ?', [req.params.id])
        res.json({ mensaje: 'Grupo eliminado' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar grupo' })
    }
})

module.exports = router