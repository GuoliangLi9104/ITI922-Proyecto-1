const mongoose = require('mongoose');

const CheckoutSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'CRC' },
  status: {
    type: String,
    enum: ['pending', 'authorized', 'paid', 'failed', 'cancelled'],
    default: 'pending'
  },
  paymentMethodId: { type: mongoose.Schema.Types.ObjectId, ref: 'PaymentMethod' },
  paymentMethodSnapshot: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  metadata: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('CheckoutSession', CheckoutSessionSchema);
