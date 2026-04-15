const db = require('../db')
const bcrypt = require('bcryptjs')

const getProfesores = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT num_cuenta, nombre, email, hora_entrada, hora_salida FROM profesor'
        )
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener profesores' })
    }
}

const eliminarProfesor = async (req, res) => {
    const { num_cuenta } = req.params
    const { contrasena } = req.body
    const id_admin = req.user.num_cuenta

    try {
        // Verificar contraseña del administrador
        const [rows] = await db.query(
            'SELECT * FROM administrador WHERE num_administrador = ?', [id_admin]
        )
        if (rows.length === 0)
            return res.status(404).json({ error: 'Administrador no encontrado' })

        const esValida = await bcrypt.compare(contrasena, rows[0].contra)
        if (!esValida)
            return res.status(401).json({ error: 'Contraseña incorrecta' })

        await db.query('DELETE FROM profesor WHERE num_cuenta = ?', [num_cuenta])
        res.json({ mensaje: 'Profesor eliminado' })

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar profesor' })
    }
}

const getHorasLibres = async (req, res) => {
    const { num_cuenta } = req.params
    try {
        const [rows] = await db.query(
            'SELECT * FROM horas_libres WHERE id_profesor = ? ORDER BY FIELD(dia, "Lunes","Martes","Miércoles","Jueves","Viernes"), hora_inicio',
            [num_cuenta]
        )
        res.json(rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener horas libres' })
    }
}

const addHoraLibre = async (req, res) => {
    const { num_cuenta } = req.params
    const { dia, hora_inicio, hora_fin } = req.body
    try {
        await db.query(
            'INSERT INTO horas_libres (id_profesor, dia, hora_inicio, hora_fin) VALUES (?, ?, ?, ?)',
            [num_cuenta, dia, hora_inicio, hora_fin]
        )
        res.status(201).json({ mensaje: 'Hora libre registrada' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al registrar hora libre' })
    }
}

const deleteHoraLibre = async (req, res) => {
    const { id_hora_libre } = req.params
    try {
        await db.query('DELETE FROM horas_libres WHERE id_hora_libre = ?', [id_hora_libre])
        res.json({ mensaje: 'Hora libre eliminada' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar hora libre' })
    }
}

module.exports = { getProfesores, eliminarProfesor, getHorasLibres, addHoraLibre, deleteHoraLibre }
