const { Review } = require('../models');

// ⚠️ Vulnerabilidad OWASP A04: Insecure Design (sin verificar si el usuario compró el producto)
exports.createReview = async (data) => {
  const review = new Review(data);
  return await review.save();
};

// Obtener reseñas de un producto
exports.getReviewsByProduct = async (productId) => {
  return await Review.find({ productId });
};
