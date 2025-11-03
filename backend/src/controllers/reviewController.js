const { Review } = require('../models');

// Crear reseña
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json({ message: 'Reseña creada', review });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear reseña' });
  }
};

// Obtener reseñas de un producto
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar reseñas' });
  }
};
