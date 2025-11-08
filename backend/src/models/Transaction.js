const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  checkoutSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CheckoutSession', required: true },
  gatewayId: String,
  status: {
    type: String,
    enum: ['pending', 'authorized', 'captured', 'failed'],
    default: 'pending'
  },
  amount: Number,
  processorResponse: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
