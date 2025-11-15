const Donation = require('../models/Donation');
const User = require('../models/User');

// Datos de las fundaciones (podrían venir de una BD después)
const foundations = [
    {
        id: 'fundacion-ayuda-animal',
        name: 'Fundación Ayuda Animal',
        description: 'Ayudamos a mascotas en situación de calle proporcionándoles alimento, cuidados médicos y buscándoles hogares amorosos.',
        image: '🐕',
        needs: ['comida', 'medicinas', 'cuidados']
    },
    {
        id: 'refugio-peludos',
        name: 'Refugio Peludos',
        description: 'Refugio temporal para perros y gatos rescatados. Trabajamos en su rehabilitación y adopción responsable.',
        image: '🏠',
        needs: ['juguetes', 'comida', 'cuidados']
    },
    {
        id: 'casa-mascotas-felices',
        name: 'Casa de Mascotas Felices',
        description: 'Centro de adopción y cuidado para animales abandonados. Promovemos la esterilización y tenencia responsable.',
        image: '❤️',
        needs: ['medicinas', 'comida', 'juguetes']
    },
    {
        id: 'hogar-temporal',
        name: 'Hogar Temporal',
        description: 'Proporcionamos hogares temporales a mascotas mientras encuentran una familia permanente.',
        image: '🏡',
        needs: ['cuidados', 'comida', 'medicinas']
    }
];

const donationController = {
    // Mostrar listado de fundaciones
    showFoundations: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        res.render('donations/foundations', {
            title: 'Donaciones - Huellitas Felices',
            user: req.session.user,
            foundations: foundations,
            success: null,
            error: null
        });
    },

    // Mostrar formulario de donación para una fundación específica
    showDonationForm: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const foundation = foundations.find(f => f.id === req.params.foundationId);
        
        if (!foundation) {
            return res.status(404).render('404', {
                title: 'Fundación No Encontrada - Huellitas Felices',
                user: req.session.user
            });
        }

        res.render('donations/donate', {
            title: `Donar a ${foundation.name} - Huellitas Felices`,
            user: req.session.user,
            foundation: foundation,
            error: null
        });
    },

    // Procesar donación
    processDonation: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const { foundationId, type, amount, description } = req.body;
            const tokensAmount = parseInt(amount);

            // Validaciones
            if (!foundationId || !type || !tokensAmount) {
                return res.render('donations/donate', {
                    title: 'Donar - Huellitas Felices',
                    user: req.session.user,
                    foundation: foundations.find(f => f.id === foundationId),
                    error: 'Todos los campos son requeridos'
                });
            }

            if (tokensAmount <= 0) {
                return res.render('donations/donate', {
                    title: 'Donar - Huellitas Felices',
                    user: req.session.user,
                    foundation: foundations.find(f => f.id === foundationId),
                    error: 'La cantidad debe ser mayor a 0'
                });
            }

            // Verificar que el usuario tiene suficientes tokens
            const user = await User.findById(req.session.user.id);
            if (user.tokens < tokensAmount) {
                return res.render('donations/donate', {
                    title: 'Donar - Huellitas Felices',
                    user: req.session.user,
                    foundation: foundations.find(f => f.id === foundationId),
                    error: `Tokens insuficientes. Tienes ${user.tokens} tokens y necesitas ${tokensAmount}`
                });
            }

            const foundation = foundations.find(f => f.id === foundationId);

            // Crear registro de donación
            const newDonation = new Donation({
                user: req.session.user.id,
                foundation: foundationId,
                type: type,
                amount: tokensAmount,
                description: description
            });

            // Restar tokens al usuario
            await user.spendTokens(tokensAmount);

            // Guardar donación
            await newDonation.save();

            // Actualizar sesión con nuevos tokens
            req.session.user.tokens = user.tokens;

            res.render('donations/foundations', {
                title: 'Donaciones - Huellitas Felices',
                user: req.session.user,
                foundations: foundations,
                success: `¡Donación exitosa! Has donado ${tokensAmount} tokens a ${foundation.name}`,
                error: null
            });

        } catch (error) {
            console.error('Error procesando donación:', error);
            res.render('donations/donate', {
                title: 'Donar - Huellitas Felices',
                user: req.session.user,
                foundation: foundations.find(f => f.id === req.body.foundationId),
                error: 'Error al procesar la donación. Intenta nuevamente.'
            });
        }
    },

    // Mostrar historial de donaciones del usuario
    showDonationHistory: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const donations = await Donation.find({ user: req.session.user.id })
                .sort({ date: -1 })
                .limit(20);

            // Mapear IDs de fundaciones a nombres
            const donationsWithFoundationNames = donations.map(donation => {
                const foundation = foundations.find(f => f.id === donation.foundation);
                return {
                    ...donation.toObject(),
                    foundationName: foundation ? foundation.name : 'Fundación Desconocida'
                };
            });

            res.render('donations/history', {
                title: 'Mi Historial de Donaciones - Huellitas Felices',
                user: req.session.user,
                donations: donationsWithFoundationNames,
                error: null
            });

        } catch (error) {
            console.error('Error cargando historial:', error);
            res.render('donations/history', {
                title: 'Mi Historial de Donaciones - Huellitas Felices',
                user: req.session.user,
                donations: [],
                error: 'Error al cargar el historial de donaciones'
            });
        }
    }
};

module.exports = donationController;