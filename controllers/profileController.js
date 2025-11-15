const User = require('../models/User');

const profileController = {
    // Mostrar perfil del usuario
    showProfile: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        res.render('profile', {
            title: 'Mi Perfil - Huellitas Felices',
            user: req.session.user,
            success: null,
            error: null
        });
    },

    // Actualizar información del perfil
    updateProfile: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const { name, phone } = req.body;

            // Actualizar en la base de datos
            const updatedUser = await User.findByIdAndUpdate(
                req.session.user.id,
                { name, phone },
                { new: true }
            );

            // Actualizar sesión
            req.session.user = {
                ...req.session.user,
                name: updatedUser.name,
                phone: updatedUser.phone
            };

            res.render('profile', {
                title: 'Mi Perfil - Huellitas Felices',
                user: req.session.user,
                success: 'Perfil actualizado correctamente',
                error: null
            });

        } catch (error) {
            console.error('Error actualizando perfil:', error);
            res.render('profile', {
                title: 'Mi Perfil - Huellitas Felices',
                user: req.session.user,
                success: null,
                error: 'Error al actualizar el perfil'
            });
        }
    },

    // Recargar tokens
    addTokens: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const { amount } = req.body;
            const tokensAmount = parseInt(amount);

            if (isNaN(tokensAmount) || tokensAmount <= 0) {
                return res.render('profile', {
                    title: 'Mi Perfil - Huellitas Felices',
                    user: req.session.user,
                    success: null,
                    error: 'Cantidad de tokens inválida'
                });
            }

            // Actualizar en la base de datos
            const user = await User.findById(req.session.user.id);
            await user.addTokens(tokensAmount);

            // Actualizar sesión
            req.session.user.tokens = user.tokens;

            res.render('profile', {
                title: 'Mi Perfil - Huellitas Felices',
                user: req.session.user,
                success: `¡${tokensAmount} tokens recargados exitosamente!`,
                error: null
            });

        } catch (error) {
            console.error('Error recargando tokens:', error);
            res.render('profile', {
                title: 'Mi Perfil - Huellitas Felices',
                user: req.session.user,
                success: null,
                error: 'Error al recargar tokens'
            });
        }
    }
};

module.exports = profileController;