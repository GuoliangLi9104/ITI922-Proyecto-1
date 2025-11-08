const mongoose = require('mongoose');

const PaymentMethodSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  brand: {
    type: String,
    enum: ['visa', 'mastercard', 'amex', 'sinpe', 'cash', 'other'],
    required: true
  },
  type: { type: String, enum: ['card', 'sinpe', 'cash'], required: true },
  last4: String,
  expMonth: Number,
  expYear: Number,
  token: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDefault: { type: Boolean, default: false }
});

PaymentMethodSchema.pre('save', function handleUpdatedAt(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('PaymentMethod', PaymentMethodSchema);
