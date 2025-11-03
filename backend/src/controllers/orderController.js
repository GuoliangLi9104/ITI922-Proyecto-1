const { Order } = require('../models');

// Crear orden
exports.createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: 'Orden creada', order });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear orden' });
  }
};

// Obtener todas las órdenes
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar órdenes' });
  }
};
