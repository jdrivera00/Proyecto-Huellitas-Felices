const User = require('../models/User');

const userController = {
    // Mostrar formulario de registro
    showRegister: (req, res) => {
        res.render('register', { 
            title: 'Registro - Huellitas Felices',
            error: null 
        });
    },

    // Procesar registro (ACTUALIZADO con phone)
    register: async (req, res) => {
        try {
            const { name, email, password, confirmPassword, phone } = req.body;

            // Validaciones básicas
            if (password !== confirmPassword) {
                return res.render('register', {
                    title: 'Registro - Huellitas Felices',
                    error: 'Las contraseñas no coinciden'
                });
            }

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.render('register', {
                    title: 'Registro - Huellitas Felices',
                    error: 'El email ya está registrado'
                });
            }

            // Crear nuevo usuario
            const newUser = new User({
                name,
                email,
                password,
                phone
            });

            await newUser.save();

            // Guardar usuario en sesión
            req.session.user = {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                tokens: newUser.tokens,
                profileImage: newUser.profileImage
            };

            res.redirect('/');

        } catch (error) {
            console.error('Error en registro:', error);
            res.render('register', {
                title: 'Registro - Huellitas Felices',
                error: 'Error al crear la cuenta. Intenta nuevamente.'
            });
        }
    },

    // Mostrar formulario de login
    showLogin: (req, res) => {
        res.render('login', { 
            title: 'Iniciar Sesión - Huellitas Felices',
            error: null 
        });
    },

    // Procesar login (ACTUALIZADO con todos los datos)
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await User.findOne({ email });
            if (!user) {
                return res.render('login', {
                    title: 'Iniciar Sesión - Huellitas Felices',
                    error: 'Email o contraseña incorrectos'
                });
            }

            // Verificar contraseña
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.render('login', {
                    title: 'Iniciar Sesión - Huellitas Felices',
                    error: 'Email o contraseña incorrectos'
                });
            }

            // Guardar usuario en sesión
            req.session.user = {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                tokens: user.tokens,
                profileImage: user.profileImage
            };

            res.redirect('/');

        } catch (error) {
            console.error('Error en login:', error);
            res.render('login', {
                title: 'Iniciar Sesión - Huellitas Felices',
                error: 'Error al iniciar sesión. Intenta nuevamente.'
            });
        }
    },

    // Cerrar sesión
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
            }
            res.redirect('/');
        });
    }
};

module.exports = userController;