// routes/index.js
const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');
const reviewRoutes = require('./reviewRoutes');
const paymentMethodRoutes = require('./paymentMethodRoutes');
const checkoutRoutes = require('./checkoutRoutes');

// Agrupar todas las rutas bajo prefijos RESTful
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/payment-methods', paymentMethodRoutes);
router.use('/checkout', checkoutRoutes);

router.get('/', (req, res) => {
  res.json({
    message: 'API VulnLearn activa ✅',
    endpoints: {
      users: '/api/users',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      reviews: '/api/reviews',
      paymentMethods: '/api/payment-methods',
      checkout: '/api/checkout'
    }
  });
});

module.exports = router;
