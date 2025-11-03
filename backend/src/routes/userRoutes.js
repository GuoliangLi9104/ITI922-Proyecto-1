const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// ⚠️ Rutas con vulnerabilidades controladas
router.post('/register', userController.register);  // contraseñas sin cifrar
router.post('/login', userController.login);        // autenticación débil
router.get('/', userController.getAllUsers);        // sin control de acceso

module.exports = router;
