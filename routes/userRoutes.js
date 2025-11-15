const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');

// Rutas de autenticación
router.get('/register', userController.showRegister);
router.post('/register', userController.register);
router.get('/login', userController.showLogin);
router.post('/login', userController.login);
router.get('/logout', userController.logout);

// Rutas de perfil
router.get('/profile', profileController.showProfile);
router.post('/profile/update', profileController.updateProfile);
router.post('/profile/add-tokens', profileController.addTokens);

module.exports = router;