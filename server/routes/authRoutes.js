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

module.exports = router;