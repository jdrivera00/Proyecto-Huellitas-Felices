const LostPet = require('../models/LostPet');
const User = require('../models/User');

const mapController = {
    // Mostrar el mapa principal
    showMap: async (req, res) => {
        try {
            const lostPets = await LostPet.find({ status: 'reportado' })
                .populate('reporter', 'name email phone')
                .sort({ date: -1 });

            res.render('map/map', {
                title: 'Mapa Interactivo - Huellitas Felices',
                user: req.session.user || null,
                lostPets: lostPets,
                mapboxToken: process.env.MAPBOX_TOKEN || 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.fake_token' // Token temporal
            });

        } catch (error) {
            console.error('Error cargando mapa:', error);
            res.render('map/map', {
                title: 'Mapa Interactivo - Huellitas Felices',
                user: req.session.user || null,
                lostPets: [],
                mapboxToken: 'pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjbGV4YW1wbGUifQ.fake_token'
            });
        }
    },

    // Mostrar formulario para reportar mascota
    showReportForm: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        res.render('map/report', {
            title: 'Reportar Mascota - Huellitas Felices',
            user: req.session.user,
            error: null,
            formData: null
        });
    },

    // Procesar reporte de mascota
    processReport: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const {
                type,
                petName,
                petType,
                breed,
                color,
                description,
                lat,
                lng,
                address,
                contactPhone,
                contactEmail
            } = req.body;

            // Validaciones básicas
            if (!type || !petName || !petType || !breed || !color || !description || !lat || !lng || !address || !contactPhone) {
                return res.render('map/report', {
                    title: 'Reportar Mascota - Huellitas Felices',
                    user: req.session.user,
                    error: 'Todos los campos marcados con * son requeridos',
                    formData: req.body
                });
            }

            // Crear nuevo reporte
            const newLostPet = new LostPet({
                type,
                petName,
                petType,
                breed,
                color,
                description,
                location: {
                    lat: parseFloat(lat),
                    lng: parseFloat(lng)
                },
                address,
                contactPhone,
                contactEmail,
                reporter: req.session.user.id
            });

            await newLostPet.save();

            res.redirect('/mapa');

        } catch (error) {
            console.error('Error creando reporte:', error);
            res.render('map/report', {
                title: 'Reportar Mascota - Huellitas Felices',
                user: req.session.user,
                error: 'Error al crear el reporte. Intenta nuevamente.',
                formData: req.body
            });
        }
    },

    // Obtener datos de mascotas para el mapa (API)
    getMapData: async (req, res) => {
        try {
            const lostPets = await LostPet.find({ status: 'reportado' })
                .populate('reporter', 'name phone')
                .select('petName petType type location address description markerColor date')
                .sort({ date: -1 });

            res.json({
                success: true,
                data: lostPets
            });

        } catch (error) {
            console.error('Error obteniendo datos del mapa:', error);
            res.status(500).json({
                success: false,
                error: 'Error al cargar los datos del mapa'
            });
        }
    },

    // Mostrar detalles de un reporte específico
    showReportDetails: async (req, res) => {
        try {
            const lostPet = await LostPet.findById(req.params.id)
                .populate('reporter', 'name email phone');

            if (!lostPet) {
                return res.status(404).render('404', {
                    title: 'Reporte No Encontrado - Huellitas Felices',
                    user: req.session.user || null
                });
            }

            res.render('map/details', {
                title: `${lostPet.petName} - Huellitas Felices`,
                user: req.session.user || null,
                lostPet: lostPet
            });

        } catch (error) {
            console.error('Error cargando detalles:', error);
            res.status(404).render('404', {
                title: 'Reporte No Encontrado - Huellitas Felices',
                user: req.session.user || null
            });
        }
    },

    // Marcar reporte como resuelto
    markAsResolved: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const lostPet = await LostPet.findById(req.params.id);

            // Verificar que el usuario es el que reportó
            if (lostPet.reporter.toString() !== req.session.user.id) {
                return res.status(403).render('404', {
                    title: 'Acceso Denegado - Huellitas Felices',
                    user: req.session.user
                });
            }

            lostPet.status = lostPet.type === 'perdido' ? 'devuelto' : 'encontrado';
            await lostPet.save();

            res.redirect('/mapa');

        } catch (error) {
            console.error('Error actualizando reporte:', error);
            res.redirect('/mapa');
        }
    }
};

module.exports = mapController;