const mongoose = require('mongoose');
const { PaymentMethod } = require('../models');

// Listar métodos de pago por usuario
exports.listByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'userId inválido' });
    }
    const methods = await PaymentMethod.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
    res.json(methods);
  } catch (error) {
    console.error('listByUser error:', error);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
};

// Crear método de pago
exports.create = async (req, res) => {
  try {
    const { userId, brand, type, last4, expMonth, expYear, token, isDefault } = req.body;
    if (!userId || !brand || !type) {
      return res.status(400).json({ error: 'userId, brand y type son requeridos' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'userId inválido' });
    }

    const paymentMethod = new PaymentMethod({
      userId,
      brand,
      type,
      last4,
      expMonth,
      expYear,
      token
    });

    const existingCount = await PaymentMethod.countDocuments({ userId });
    if (isDefault || existingCount === 0) {
      await PaymentMethod.updateMany({ userId }, { isDefault: false });
      paymentMethod.isDefault = true;
    }

    await paymentMethod.save();
    res.status(201).json({ message: 'Método de pago creado', paymentMethod });
  } catch (error) {
    console.error('create payment method error:', error);
    res.status(500).json({ error: 'Error al crear método de pago' });
  }
};

// Establecer método por defecto
exports.setDefault = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }
    const method = await PaymentMethod.findById(id);
    if (!method) return res.status(404).json({ error: 'Método no encontrado' });

    await PaymentMethod.updateMany({ userId: method.userId }, { isDefault: false });
    method.isDefault = true;
    await method.save();

    res.json({ message: 'Método marcado como principal', paymentMethod: method });
  } catch (error) {
    console.error('setDefault error:', error);
    res.status(500).json({ error: 'Error al actualizar método' });
  }
};

// Eliminar método
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const removed = await PaymentMethod.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: 'Método no encontrado' });

    if (removed.isDefault) {
      await PaymentMethod.findOneAndUpdate(
        { userId: removed.userId },
        { isDefault: true },
        { sort: { createdAt: -1 } }
      );
    }

    res.json({ message: 'Método eliminado' });
  } catch (error) {
    console.error('remove payment method error:', error);
    res.status(500).json({ error: 'Error al eliminar método' });
  }
};
