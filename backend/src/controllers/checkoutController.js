const mongoose = require('mongoose');
const { CheckoutSession, PaymentMethod, Order, Transaction, Cart } = require('../models');

const ensureObjectId = (id, label) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`${label} inválido`);
    error.statusCode = 400;
    throw error;
  }
};

const buildSnapshotFromMethod = method => ({
  type: method.type,
  brand: method.brand,
  last4: method.last4,
  expMonth: method.expMonth,
  expYear: method.expYear,
  isDefault: method.isDefault
});

// POST /api/checkout/start
exports.startSession = async (req, res) => {
  try {
    const { userId, orderId, paymentMethodId, amount, currency = 'CRC', paymentMethodSnapshot = {}, metadata = {} } =
      req.body;
    if (!userId || !orderId) {
      return res.status(400).json({ error: 'userId y orderId son requeridos' });
    }
    ensureObjectId(userId, 'userId');
    ensureObjectId(orderId, 'orderId');

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    if (order.userId && order.userId.toString() !== userId) {
      return res.status(403).json({ error: 'Orden no pertenece al usuario' });
    }
    if (order.status !== 'pending') {
      return res.status(409).json({ error: 'La orden ya no está pendiente' });
    }

    let method = null;
    if (paymentMethodId) {
      ensureObjectId(paymentMethodId, 'paymentMethodId');
      method = await PaymentMethod.findById(paymentMethodId);
      if (!method) return res.status(404).json({ error: 'Método de pago no encontrado' });
      if (method.userId.toString() !== userId) {
        return res.status(403).json({ error: 'Método no pertenece al usuario' });
      }
    }

    const session = new CheckoutSession({
      userId,
      orderId,
      amount: typeof amount === 'number' ? amount : order.total,
      currency,
      paymentMethodId: method ? method._id : undefined,
      paymentMethodSnapshot: method ? buildSnapshotFromMethod(method) : paymentMethodSnapshot,
      metadata
    });

    await session.save();
    order.checkoutSessionId = session._id;
    await order.save();

    res.status(201).json({ message: 'Checkout iniciado', session });
  } catch (error) {
    console.error('startSession error:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.statusCode ? error.message : 'Error al iniciar checkout' });
  }
};

const getSessionWithOrder = async sessionId => {
  ensureObjectId(sessionId, 'sessionId');
  const session = await CheckoutSession.findById(sessionId).populate('paymentMethodId');
  if (!session) {
    const error = new Error('CheckoutSession no encontrada');
    error.statusCode = 404;
    throw error;
  }
  const order = await Order.findById(session.orderId);
  if (!order) {
    const error = new Error('Orden vinculada no existe');
    error.statusCode = 404;
    throw error;
  }
  return { session, order };
};

const determinePaymentType = session =>
  session.paymentMethodId?.type ||
  session.paymentMethodSnapshot?.type ||
  session.metadata?.paymentType ||
  'cash';

const recordTransaction = async ({ session, status, amount, processorResponse }) => {
  try {
    await Transaction.create({
      checkoutSessionId: session._id,
      status,
      amount: amount ?? session.amount,
      processorResponse
    });
  } catch (error) {
    console.error('recordTransaction error:', error);
  }
};

const markOrderAsPaid = async order => {
  order.status = 'paid';
  order.paidAt = new Date();
  await order.save();
  await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });
};

// POST /api/checkout/:sessionId/confirm
exports.confirmSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { forceFail, gatewayResponse = {}, metadata = {} } = req.body;
    const { session, order } = await getSessionWithOrder(sessionId);

    if (['cancelled', 'paid', 'failed'].includes(session.status)) {
      return res.status(409).json({ error: `La sesión ya está ${session.status}` });
    }

    const paymentType = determinePaymentType(session);
    let newStatus = 'pending';
    let responsePayload = {};

    if (paymentType === 'cash') {
      newStatus = 'paid';
      session.completedAt = new Date();
    } else if (paymentType === 'sinpe') {
      newStatus = 'authorized';
      responsePayload.instructions = 'Transferir vía SINPE móvil antes de 12h.';
    } else {
      newStatus = forceFail ? 'failed' : 'paid';
      if (newStatus === 'paid') {
        session.completedAt = new Date();
      }
    }

    session.status = newStatus;
    session.metadata = { ...(session.metadata || {}), ...metadata };

    await recordTransaction({
      session,
      status: newStatus === 'paid' ? 'captured' : newStatus,
      amount: session.amount,
      processorResponse: gatewayResponse
    });

    if (newStatus === 'paid') {
      await markOrderAsPaid(order);
    } else if (newStatus === 'failed') {
      order.status = 'pending';
      await order.save();
    } else {
      await order.save();
    }

    await session.save();

    res.json({
      message: 'Checkout actualizado',
      session,
      order,
      ...responsePayload
    });
  } catch (error) {
    console.error('confirmSession error:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.statusCode ? error.message : 'Error al confirmar checkout' });
  }
};

// POST /api/checkout/:sessionId/cancel
exports.cancelSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { session, order } = await getSessionWithOrder(sessionId);

    if (session.status === 'paid') {
      return res.status(409).json({ error: 'No se puede cancelar una sesión pagada' });
    }

    session.status = 'cancelled';
    session.completedAt = new Date();
    order.checkoutSessionId = undefined;

    await session.save();
    await order.save();

    res.json({ message: 'Checkout cancelado', session, order });
  } catch (error) {
    console.error('cancelSession error:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.statusCode ? error.message : 'Error al cancelar checkout' });
  }
};

// GET /api/checkout/:sessionId/status
exports.getStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { session, order } = await getSessionWithOrder(sessionId);
    res.json({ session, order });
  } catch (error) {
    console.error('getStatus error:', error);
    res
      .status(error.statusCode || 500)
      .json({ error: error.statusCode ? error.message : 'Error al consultar checkout' });
  }
};
