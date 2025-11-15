const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre de la mascota es requerido'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'El tipo de mascota es requerido'],
        enum: ['perro', 'gato']
    },
    breed: {
        type: String,
        required: [true, 'La raza es requerida'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'La edad es requerida'],
        min: [0, 'La edad no puede ser negativa']
    },
    gender: {
        type: String,
        required: [true, 'El género es requerido'],
        enum: ['macho', 'hembra']
    },
    size: {
        type: String,
        required: [true, 'El tamaño es requerido'],
        enum: ['pequeño', 'mediano', 'grande']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    image: {
        type: String,
        default: '/images/pets/default-pet.jpg'
    },
    status: {
        type: String,
        enum: ['disponible', 'adoptado', 'pendiente'],
        default: 'disponible'
    },
    location: {
        type: String,
        required: [true, 'La ubicación es requerida']
    },
    phoneContact: {
        type: String,
        required: [true, 'El teléfono de contacto es requerido']
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pet', petSchema);