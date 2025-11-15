const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const upload = require('../config/multer');

// Ruta GET para mostrar el formulario
router.get('/mascotas/publicar/nueva', petController.showCreateForm);

// Ruta POST para procesar el formulario (SIN middleware de debug problemático)
router.post('/mascotas/publicar/nueva', upload.single('image'), petController.createPet);

// Rutas públicas
router.get('/mascotas', petController.showPets);
router.get('/mascotas/:id', petController.showPetDetails);

// Ruta para marcar como adoptado
router.post('/mascotas/:id/adoptado', petController.markAsAdopted);

module.exports = router;