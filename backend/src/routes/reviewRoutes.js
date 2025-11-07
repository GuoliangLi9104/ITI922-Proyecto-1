// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Crear reseña
router.post('/', reviewController.createReview);

// Listar reseñas de un producto
router.get('/product/:productId', reviewController.getReviews);

// Obtener una reseña específica
router.get('/:id', reviewController.getReviewById);

// Actualizar reseña
router.put('/:id', reviewController.updateReview);

// Eliminar reseña
router.delete('/:id', reviewController.deleteReview);

module.exports = router;
