// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Crear o agregar producto
router.post('/', cartController.addToCart);

// Obtener carrito por usuario
router.get('/:userId', cartController.getCart);

// Actualizar cantidad o item
router.put('/item', cartController.updateItem);

// Eliminar un item del carrito
router.delete('/item', cartController.removeItem);

// Vaciar carrito
router.delete('/clear/:userId', cartController.clearCart);

module.exports = router;
