const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

// Rutas de donaciones (requieren autenticación)
router.get('/donaciones', donationController.showFoundations);
router.get('/donaciones/historial', donationController.showDonationHistory);
router.get('/donaciones/donar/:foundationId', donationController.showDonationForm);
router.post('/donaciones/procesar', donationController.processDonation);

module.exports = router;