// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Crear orden
router.post('/', orderController.createOrder);

// Listar todas las órdenes
router.get('/', orderController.getOrders);

// Obtener orden por ID
router.get('/:id', orderController.getOrderById);

// Actualizar orden
router.put('/:id', orderController.updateOrder);

// Eliminar orden
router.delete('/:id', orderController.deleteOrder);

module.exports = router;
