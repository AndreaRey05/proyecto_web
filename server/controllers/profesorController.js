const db = require('../db')

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
    try {
        await db.query('DELETE FROM profesor WHERE num_cuenta = ?', [num_cuenta])
        res.json({ mensaje: 'Profesor eliminado' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar profesor' })
    }
}

module.exports = { getProfesores, eliminarProfesor }