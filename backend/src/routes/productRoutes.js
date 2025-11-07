// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Crear producto
router.post('/', productController.createProduct);

// Listar productos
router.get('/', productController.getProducts);

// Obtener producto por ID
router.get('/:id', productController.getProductById);

// Actualizar producto
router.put('/:id', productController.updateProduct);

// Eliminar producto
router.delete('/:id', productController.deleteProduct);

module.exports = router;
