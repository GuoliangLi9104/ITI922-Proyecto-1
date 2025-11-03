const { Cart, Product } = require('../models');

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // ⚠️ Vulnerable: sin validar propiedad del carrito
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existing = cart.items.find(item => item.productId.toString() === productId);
    if (existing) existing.quantity += quantity;
    else cart.items.push({ productId, quantity });

    await cart.save();
    res.json({ message: 'Producto agregado al carrito', cart });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};

// Ver carrito
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};
