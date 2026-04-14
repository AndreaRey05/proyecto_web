const db = require('../db')
const bcrypt = require('bcryptjs')

const getProfesores = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT num_cuenta, nombre, hora_entrada, hora_salida FROM profesor'
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

module.exports = { getProfesores, eliminarProfesor }