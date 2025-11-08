const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: Number,
      price: Number
    }
  ],
  shippingAddress: String,
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card', 'sinpe'], default: 'cash' },
  checkoutSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'CheckoutSession' },
  paidAt: Date,
  status: { type: String, enum: ['pending', 'paid', 'shipped'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
