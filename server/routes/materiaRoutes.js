const express     = require('express')
const router      = express.Router()
const verifyToken = require('../middleware/verifyToken')
const bcrypt      = require('bcrypt')
const db          = require('../db')

router.get('/', verifyToken, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM materia')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener materias' })
    }
})

router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params
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

        const [result] = await db.query('DELETE FROM materia WHERE id_materia = ?', [id])
        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'Materia no encontrada' })

        res.json({ mensaje: 'Materia eliminada correctamente' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar materia' })
    }
})

router.post('/', verifyToken, async (req, res) => {
    if (req.user.rol !== 'administrador')
        return res.status(403).json({ error: 'Sin permisos' })

    const { nombre } = req.body
    if (!nombre)
        return res.status(400).json({ error: 'Nombre y semestre son requeridos' })

    try {
        const [result] = await db.query(
            'INSERT INTO materia (nombre, semestre) VALUES (?, ?)', [nombre, semestre]
        )
        res.json({ id_materia: result.insertId, nombre, semestre })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al crear materia' })
    }
})

module.exports = router