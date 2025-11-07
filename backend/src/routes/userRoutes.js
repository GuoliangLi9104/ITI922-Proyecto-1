// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Registro y login
router.post('/register', userController.register);
router.post('/login', userController.login);

// Obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Obtener usuario por ID
router.get('/:id', userController.getUserById);

// Actualizar usuario
router.put('/:id', userController.updateUser);

// Eliminar usuario
router.delete('/:id', userController.deleteUser);

module.exports = router;
