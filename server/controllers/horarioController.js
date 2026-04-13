const db = require('../db');

const getHorario = async (req, res) => {
  try {
    const [clases] = await db.query(`
      SELECT
        c.id_clase,
        c.dia,
        c.hora_inicio,
        c.hora_fin,
        s.nombre    AS salon,
        s.capacidad,
        p.nombre    AS profesor,
        p.hora_entrada,
        p.hora_salida,
        g.nombre    AS grupo,
        g.semestre,
        m.nombre    AS materia,
        m.semestre  AS semestre_materia
      FROM clase c
      JOIN salon    s ON c.id_salon    = s.id_salon
      JOIN profesor p ON c.id_profesor = p.num_cuenta
      JOIN grupo    g ON c.id_grupo    = g.id_grupo
      JOIN materia  m ON c.id_materia  = m.id_materia
      ORDER BY FIELD(c.dia,
        'lunes','martes','miercoles','jueves','viernes'),
        c.hora_inicio
    `);

    res.json(clases);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el horario' });
  }
};

module.exports = { getHorario };