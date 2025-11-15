const mongoose = require('mongoose');

const lostPetSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['perdido', 'encontrado']
    },
    petName: {
        type: String,
        required: [true, 'El nombre de la mascota es requerido'],
        trim: true
    },
    petType: {
        type: String,
        required: [true, 'El tipo de mascota es requerido'],
        enum: ['perro', 'gato', 'otro']
    },
    breed: {
        type: String,
        required: [true, 'La raza es requerida'],
        trim: true
    },
    color: {
        type: String,
        required: [true, 'El color es requerido'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    location: {
        lat: {
            type: Number,
            required: true
        },
        lng: {
            type: Number,
            required: true
        }
    },
    address: {
        type: String,
        required: [true, 'La dirección es requerida']
    },
    contactPhone: {
        type: String,
        required: [true, 'El teléfono de contacto es requerido']
    },
    contactEmail: {
        type: String,
        trim: true
    },
    markerColor: {
        type: String,
        enum: ['red', 'green'],
        default: 'red'
    },
    status: {
        type: String,
        enum: ['reportado', 'devuelto', 'encontrado'],
        default: 'reportado'
    },
    date: {
        type: Date,
        default: Date.now
    },
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: {
        type: String,
        default: '/images/pets/default-pet.jpg'
    }
});

// Asignar color del marcador basado en el tipo
lostPetSchema.pre('save', function(next) {
    this.markerColor = this.type === 'perdido' ? 'red' : 'green';
    next();
});

module.exports = mongoose.model('LostPet', lostPetSchema);