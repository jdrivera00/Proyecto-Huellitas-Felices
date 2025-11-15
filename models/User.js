const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    phone: {
        type: String,
        trim: true
    },
    profileImage: {
        type: String,
        default: '/images/default-avatar.jpg'
    },
    tokens: {
        type: Number,
        default: 100  // Tokens iniciales para donaciones
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Método para encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para recargar tokens
userSchema.methods.addTokens = async function(amount) {
    this.tokens += amount;
    return await this.save();
};

// Método para gastar tokens
userSchema.methods.spendTokens = async function(amount) {
    if (this.tokens < amount) {
        throw new Error('Tokens insuficientes');
    }
    this.tokens -= amount;
    return await this.save();
};

module.exports = mongoose.model('User', userSchema);