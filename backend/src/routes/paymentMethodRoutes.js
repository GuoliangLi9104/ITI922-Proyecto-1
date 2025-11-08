const express = require('express');
const router = express.Router();
const paymentMethodController = require('../controllers/paymentMethodController');

router.post('/', paymentMethodController.create);
router.get('/user/:userId', paymentMethodController.listByUser);
router.put('/:id/default', paymentMethodController.setDefault);
router.delete('/:id', paymentMethodController.remove);

module.exports = router;
