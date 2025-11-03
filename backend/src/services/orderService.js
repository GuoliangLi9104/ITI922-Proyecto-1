const { Order } = require('../models');

// Crear una nueva orden
exports.createOrder = async (orderData) => {
  const order = new Order(orderData);
  return await order.save();
};

// Listar todas las órdenes (⚠️ Vulnerabilidad OWASP A01: sin control de acceso)
exports.getOrders = async () => {
  return await Order.find().populate('userId').populate('products.productId');
};
