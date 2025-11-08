const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.post('/start', checkoutController.startSession);
router.post('/:sessionId/confirm', checkoutController.confirmSession);
router.post('/:sessionId/cancel', checkoutController.cancelSession);
router.get('/:sessionId/status', checkoutController.getStatus);

module.exports = router;
