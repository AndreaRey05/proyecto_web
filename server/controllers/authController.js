const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../db');

const login = async (req, res) => {
  const { num_cuenta, contra, rol } = req.body;
  // rol viene del cliente: 'profesor', 'alumno' o 'administrador'

  try {
    let query;
    if (rol === 'profesor')
      query = 'SELECT * FROM profesor WHERE num_cuenta = ?';
    else if (rol === 'alumno')
      query = 'SELECT * FROM alumno WHERE num_cuenta = ?';
    else if (rol === 'administrador')
      query = 'SELECT * FROM administrador WHERE num_administrador = ?';
    else
      return res.status(400).json({ error: 'Rol inválido' });

    const [rows] = await db.query(query, [num_cuenta]);

    if (rows.length === 0)
      return res.status(404).json({ error: 'Usuario no encontrado' });

    const usuario = rows[0];

    const esValida = await bcrypt.compare(contra, usuario.contra);
    if (!esValida)
      return res.status(401).json({ error: 'Contraseña incorrecta' });

    // Genera el token con num_cuenta y rol
    const token = jwt.sign(
      { num_cuenta: usuario.num_cuenta || usuario.num_administrador, rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, rol });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = { login };