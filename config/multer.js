const multer = require('multer');
const path = require('path');

// Configuración MUY simple de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/pets/');
    },
    filename: function (req, file, cb) {
        // Nombre simple sin caracteres especiales
        const safeName = 'pet-' + Date.now() + path.extname(file.originalname);
        cb(null, safeName);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        // Aceptar cualquier imagen sin validaciones estrictas
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten imágenes'), false);
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB máximo
    }
});

module.exports = upload;