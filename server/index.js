const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const authRoutes    = require('./routes/authRoutes');
const horarioRoutes = require('./routes/horarioRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',    authRoutes);
app.use('/api/horario', horarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});