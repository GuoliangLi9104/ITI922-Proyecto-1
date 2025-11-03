const { Cart } = require('../models');

// ⚠️ Vulnerabilidad OWASP A01: Broken Access Control (sin validar propietario del carrito)
exports.addToCart = async (userId, productId, quantity) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const existing = cart.items.find(item => item.productId.toString() === productId);
  if (existing) existing.quantity += quantity;
  else cart.items.push({ productId, quantity });

  await cart.save();
  return cart;
};

exports.getCartByUser = async (userId) => {
  return await Cart.findOne({ userId }).populate('items.productId');
};
