const db = require('../db');

const getHorario = async (req, res) => {
    try {
        const { semestre, id_profesor, id_salon, dia, hora } = req.query

        let conditions = []
        let params = []

        if (semestre) {
            conditions.push('g.semestre = ?')
            params.push(semestre)
        }
        if (id_profesor) {
            conditions.push('c.id_profesor = ?')
            params.push(id_profesor)
        }
        if (id_salon) {
            conditions.push('c.id_salon = ?')
            params.push(id_salon)
        }
        if (dia) {
            conditions.push('c.dia = ?')
            params.push(dia)
        }
        if (hora) {
            conditions.push('? BETWEEN c.hora_inicio AND c.hora_fin')
            params.push(hora)
        }

        const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

        const [clases] = await db.query(`
            SELECT
                c.id_clase,
                c.dia,
                c.hora_inicio,
                c.hora_fin,
                s.nombre    AS salon,
                s.capacidad,
                p.num_cuenta AS num_cuenta_profesor,
                p.nombre    AS profesor,
                p.email     AS email_profesor,
                p.hora_entrada,
                p.hora_salida,
                g.nombre    AS grupo,
                g.semestre,
                m.nombre    AS materia
            FROM clase c
            JOIN salon    s ON c.id_salon    = s.id_salon
            JOIN profesor p ON c.id_profesor = p.num_cuenta
            JOIN grupo    g ON c.id_grupo    = g.id_grupo
            JOIN materia  m ON c.id_materia  = m.id_materia
            ${where}
            ORDER BY FIELD(c.dia,
                'lunes','martes','miercoles','jueves','viernes'),
                c.hora_inicio
        `, params)

        res.json(clases)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el horario' })
    }
};

const addClase = async (req, res) => {
    const { id_grupo, id_profesor, id_materia, id_salon, dia, hora_inicio, hora_fin } = req.body
    try {
        await db.query(
            'INSERT INTO clase (id_grupo, id_profesor, id_materia, id_salon, dia, hora_inicio, hora_fin) VALUES (?,?,?,?,?,?,?)',
            [id_grupo, id_profesor, id_materia, id_salon, dia, hora_inicio, hora_fin]
        )
        res.status(201).json({ mensaje: 'Clase agregada' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al agregar clase' })
    }
}

module.exports = { getHorario, addClase };