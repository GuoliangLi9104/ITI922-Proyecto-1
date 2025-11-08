// controllers/orderController.js
const mongoose = require('mongoose');
const { Order } = require('../models');

// Crear orden
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, products: productsFromBody, total, shippingAddress, paymentMethod = 'cash' } = req.body;
    const productList = Array.isArray(items) && items.length ? items : productsFromBody;
    if (!userId || !Array.isArray(productList) || productList.length === 0) {
      return res.status(400).json({ error: 'userId y lista de productos requerida' });
    }
    if (typeof total !== 'number') {
      return res.status(400).json({ error: 'total numérico requerido' });
    }
    const order = new Order({
      userId,
      products: productList,
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending'
    });
    await order.save();
    res.status(201).json({ message: 'Orden creada', order });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ error: 'Error al crear orden' });
  }
};

// Obtener todas las órdenes
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('getOrders error:', error);
    res.status(500).json({ error: 'Error al listar órdenes' });
  }
};

// Obtener orden por id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (error) {
    console.error('getOrderById error:', error);
    res.status(500).json({ error: 'Error al obtener orden' });
  }
};

// Actualizar orden (ej. status, dirección)
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const updated = await Order.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json({ message: 'Orden actualizada', order: updated });
  } catch (error) {
    console.error('updateOrder error:', error);
    res.status(500).json({ error: 'Error al actualizar orden' });
  }
};

// Eliminar orden
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    console.error('deleteOrder error:', error);
    res.status(500).json({ error: 'Error al eliminar orden' });
  }
};
