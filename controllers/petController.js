const Pet = require('../models/Pet');
const User = require('../models/User');

const petController = {
    // Mostrar listado de mascotas
    showPets: async (req, res) => {
        try {
            const { tipo, tamaño, género } = req.query;
            let filter = { status: 'disponible' };

            // Aplicar filtros si existen
            if (tipo) filter.type = tipo;
            if (tamaño) filter.size = tamaño;
            if (género) filter.gender = género;

            const pets = await Pet.find(filter)
                .populate('owner', 'name email phone')
                .sort({ createdAt: -1 });

            res.render('pets/list', {
                title: 'Mascotas en Adopción - Huellitas Felices',
                user: req.session.user || null,
                pets: pets,
                filters: { tipo, tamaño, género }
            });

        } catch (error) {
            console.error('Error cargando mascotas:', error);
            res.render('pets/list', {
                title: 'Mascotas en Adopción - Huellitas Felices',
                user: req.session.user || null,
                pets: [],
                filters: {},
                error: 'Error al cargar las mascotas'
            });
        }
    },

    // Mostrar formulario para publicar mascota
    showCreateForm: (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        res.render('pets/create', {
            title: 'Publicar Mascota - Huellitas Felices',
            user: req.session.user,
            error: null
        });
    },

    // Procesar publicación de mascota (VERSIÓN CORREGIDA - SIN MULTER DENTRO)
    createPet: async (req, res) => {
        try {
            // DEBUG SEGURO - Agregar al principio del método
            console.log('📤 Formulario recibido correctamente');
            console.log('📝 Campos del formulario:', Object.keys(req.body || {}));
            console.log('📸 Archivo recibido:', req.file ? req.file.filename : 'Ninguno');
            
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const {
                name,
                type,
                breed,
                age,
                gender,
                size,
                description,
                location,
                phoneContact
            } = req.body;

            // Validar campos requeridos
            if (!name || !type || !breed || !age || !gender || !size || !description || !location || !phoneContact) {
                return res.render('pets/create', {
                    title: 'Publicar Mascota - Huellitas Felices',
                    user: req.session.user,
                    error: 'Todos los campos marcados con * son requeridos'
                });
            }

            // Preparar datos de la mascota
            const petData = {
                name,
                type,
                breed,
                age: parseInt(age),
                gender,
                size,
                description,
                location,
                phoneContact,
                owner: req.session.user.id
            };

            // Si se subió una imagen, guardar la ruta
            if (req.file) {
                petData.image = '/images/pets/' + req.file.filename;
                console.log('📸 Imagen subida:', req.file.filename);
            } else {
                console.log('ℹ️ No se subió imagen, usando valor por defecto');
            }

            // Crear nueva mascota
            const newPet = new Pet(petData);
            await newPet.save();

            console.log('✅ Mascota publicada:', newPet.name);
            res.redirect('/mascotas');

        } catch (error) {
            console.error('❌ Error creando mascota:', error);
            res.render('pets/create', {
                title: 'Publicar Mascota - Huellitas Felices',
                user: req.session.user,
                error: 'Error al publicar la mascota. Intenta nuevamente.'
            });
        }
    },

    // Mostrar detalles de una mascota
    showPetDetails: async (req, res) => {
        try {
            const pet = await Pet.findById(req.params.id)
                .populate('owner', 'name email phone');

            if (!pet) {
                return res.status(404).render('404', {
                    title: 'Mascota No Encontrada - Huellitas Felices',
                    user: req.session.user || null
                });
            }

            res.render('pets/details', {
                title: `${pet.name} - Huellitas Felices`,
                user: req.session.user || null,
                pet: pet
            });

        } catch (error) {
            console.error('Error cargando mascota:', error);
            res.status(404).render('404', {
                title: 'Mascota No Encontrada - Huellitas Felices',
                user: req.session.user || null
            });
        }
    },

    // Marcar mascota como adoptada
    markAsAdopted: async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            const pet = await Pet.findById(req.params.id);

            // Verificar que el usuario es el dueño de la mascota
            if (pet.owner.toString() !== req.session.user.id) {
                return res.status(403).render('404', {
                    title: 'Acceso Denegado - Huellitas Felices',
                    user: req.session.user
                });
            }

            pet.status = 'adoptado';
            await pet.save();

            res.redirect('/mascotas');

        } catch (error) {
            console.error('Error actualizando mascota:', error);
            res.redirect('/mascotas');
        }
    }
};

module.exports = petController;