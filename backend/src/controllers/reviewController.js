// controllers/reviewController.js
const mongoose = require('mongoose');
const { Review } = require('../models');

// Crear reseña
exports.createReview = async (req, res) => {
  try {
    const { productId, userId, rating, comment } = req.body;
    if (!productId || !userId || typeof rating === 'undefined') {
      return res.status(400).json({ error: 'productId, userId y rating son requeridos' });
    }
    const review = new Review({ productId, userId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Reseña creada', review });
  } catch (error) {
    console.error('createReview error:', error);
    res.status(500).json({ error: 'Error al crear reseña' });
  }
};

// Obtener reseñas de un producto
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'productId inválido' });
    }
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (error) {
    console.error('getReviews error:', error);
    res.status(500).json({ error: 'Error al listar reseñas' });
  }
};

// Obtener reseña por id
exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json(review);
  } catch (error) {
    console.error('getReviewById error:', error);
    res.status(500).json({ error: 'Error al obtener reseña' });
  }
};

// Actualizar reseña
exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const updated = await Review.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json({ message: 'Reseña actualizada', review: updated });
  } catch (error) {
    console.error('updateReview error:', error);
    res.status(500).json({ error: 'Error al actualizar reseña' });
  }
};

// Eliminar reseña
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await Review.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Reseña no encontrada' });
    res.json({ message: 'Reseña eliminada' });
  } catch (error) {
    console.error('deleteReview error:', error);
    res.status(500).json({ error: 'Error al eliminar reseña' });
  }
};
