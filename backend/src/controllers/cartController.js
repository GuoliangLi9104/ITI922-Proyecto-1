// controllers/cartController.js
const mongoose = require('mongoose');
const { Cart, Product } = require('../models');

// Agregar producto al carrito
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'userId y productId requeridos' });
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ error: 'IDs inválidos' });

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existing = cart.items.find(item => item.productId.toString() === productId);
    if (existing) existing.quantity += Number(quantity);
    else cart.items.push({ productId, quantity: Number(quantity) });

    await cart.save();
    const populated = await cart.populate('items.productId');
    res.json({ message: 'Producto agregado al carrito', cart: populated });
  } catch (error) {
    console.error('addToCart error:', error);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
};

// Ver carrito por userId
exports.getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: 'userId inválido' });
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    console.error('getCart error:', error);
    res.status(500).json({ error: 'Error al obtener carrito' });
  }
};

// Actualizar cantidad de un item
exports.updateItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || typeof quantity === 'undefined') return res.status(400).json({ error: 'userId, productId y quantity requeridos' });
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ error: 'IDs inválidos' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const item = cart.items.find(i => i.productId.toString() === productId);
    if (!item) return res.status(404).json({ error: 'Producto no está en el carrito' });

    if (Number(quantity) <= 0) {
      // eliminar si cantidad <= 0
      cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();
    const populated = await cart.populate('items.productId');
    res.json({ message: 'Carrito actualizado', cart: populated });
  } catch (error) {
    console.error('updateItem error:', error);
    res.status(500).json({ error: 'Error al actualizar item' });
  }
};

// Eliminar un item del carrito
exports.removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) return res.status(400).json({ error: 'userId y productId requeridos' });
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ error: 'IDs inválidos' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    await cart.save();
    const populated = await cart.populate('items.productId');
    res.json({ message: 'Item removido', cart: populated });
  } catch (error) {
    console.error('removeItem error:', error);
    res.status(500).json({ error: 'Error al remover item' });
  }
};

// Vaciar carrito
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).json({ error: 'userId inválido' });
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    cart.items = [];
    await cart.save();
    res.json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error('clearCart error:', error);
    res.status(500).json({ error: 'Error al vaciar carrito' });
  }
};
