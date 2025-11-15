const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foundation: {
        type: String,
        required: true,
        enum: ['fundacion-ayuda-animal', 'refugio-peludos', 'casa-mascotas-felices', 'hogar-temporal']
    },
    type: {
        type: String,
        required: true,
        enum: ['comida', 'juguetes', 'medicinas', 'cuidados', 'otro']
    },
    amount: {
        type: Number,
        required: [true, 'La cantidad de tokens es requerida'],
        min: [1, 'La donación debe ser de al menos 1 token']
    },
    description: {
        type: String,
        maxlength: [200, 'La descripción no puede exceder 200 caracteres']
    },
    status: {
        type: String,
        enum: ['completada', 'pendiente', 'cancelada'],
        default: 'completada'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', donationSchema);