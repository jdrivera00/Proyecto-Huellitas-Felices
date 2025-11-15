require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración básica
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'mi-secreto-super-seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Importar y usar rutas - ESTO ES LO MÁS IMPORTANTE
const userRoutes = require('./routes/userRoutes');
const petRoutes = require('./routes/petRoutes');
const donationRoutes = require('./routes/donationRoutes'); 
const mapRoutes = require('./routes/mapRoutes');

app.use('/', userRoutes);
app.use('/', petRoutes);
app.use('/', donationRoutes);
app.use('/', mapRoutes)

// Ruta básica de prueba
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Inicio - Huellitas Felices',
        user: req.session.user || null 
    });
});

// Ruta de Sobre Nosotros (temporal)
app.get('/nosotros', (req, res) => {
    res.render('nosotros', { 
        title: 'Sobre Nosotros - Huellitas Felices',
        user: req.session.user || null 
    });
});

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-adoption')
.then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
})
.catch(err => {
    console.error('❌ Error conectando a MongoDB:', err);
    
    // Iniciar servidor aunque falle MongoDB
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT} (sin base de datos)`);
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).render('404', { 
        title: 'Página No Encontrada - Huellitas Felices',
        user: req.session.user || null 
    });
});

module.exports = app;