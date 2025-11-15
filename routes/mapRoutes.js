const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');

// Rutas del mapa
router.get('/mapa', mapController.showMap);
router.get('/mapa/reportar', mapController.showReportForm);
router.post('/mapa/reportar', mapController.processReport);
router.get('/mapa/reporte/:id', mapController.showReportDetails);
router.post('/mapa/reporte/:id/resuelto', mapController.markAsResolved);
router.get('/api/mapa/datos', mapController.getMapData);

module.exports = router;