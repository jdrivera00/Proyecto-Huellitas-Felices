require('dotenv').config();
const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const User = require('./models/User');

// Datos de prueba
const samplePets = [
    {
        name: "Max",
        type: "perro",
        breed: "Labrador Retriever",
        age: 2,
        gender: "macho",
        size: "grande",
        description: "Max es un labrador muy juguetón y cariñoso. Le encanta correr en el parque y jugar con la pelota. Está entrenado básicamente y es muy bueno con los niños.",
        location: "Bogotá, Chapinero",
        phoneContact: "3001234567",
        status: "disponible"
    },
    {
        name: "Luna",
        type: "gato",
        breed: "Siamés",
        age: 1,
        gender: "hembra",
        size: "pequeño",
        description: "Luna es una gatita siamesa muy tranquila y elegante. Le gusta dormir en lugares cálidos y es muy limpia. Ideal para apartamento.",
        location: "Medellín, El Poblado",
        phoneContact: "3007654321",
        status: "disponible"
    },
    {
        name: "Rocky",
        type: "perro",
        breed: "Bulldog Francés",
        age: 3,
        gender: "macho",
        size: "mediano",
        description: "Rocky es un bulldog francés muy simpático y tranquilo. No requiere mucho ejercicio y es perfecto para vida en apartamento. Muy amigable con otros perros.",
        location: "Cali, Granada",
        phoneContact: "3005558899",
        status: "disponible"
    },
    {
        name: "Mimi",
        type: "gato",
        breed: "Persa",
        age: 2,
        gender: "hembra",
        size: "mediano",
        description: "Mimi es una gata persa de pelaje largo y suave. Muy tranquila y cariñosa. Requiere cepillado regular. Perfecta para familias tranquilas.",
        location: "Barranquilla, Norte",
        phoneContact: "3004445566",
        status: "disponible"
    },
    {
        name: "Toby",
        type: "perro",
        breed: "Golden Retriever",
        age: 4,
        gender: "macho",
        size: "grande",
        description: "Toby es un golden retriever muy inteligente y leal. Está entrenado en obediencia básica y es excelente con niños. Le encanta nadar y jugar.",
        location: "Bogotá, Usaquén",
        phoneContact: "3007778888",
        status: "disponible"
    },
    {
        name: "Nala",
        type: "gato",
        breed: "Mestizo",
        age: 1,
        gender: "hembra",
        size: "pequeño",
        description: "Nala es una gatita mestiza muy juguetona y curiosa. Fue rescatada de la calle y está buscando un hogar amoroso. Muy cariñosa una vez que genera confianza.",
        location: "Medellín, Laureles",
        phoneContact: "3002223333",
        status: "disponible"
    }
];

// Función para insertar datos de prueba
async function seedDatabase() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pet-adoption');
        console.log('✅ Conectado a MongoDB Atlas');

        // Limpiar la colección de mascotas existente
        await Pet.deleteMany({});
        console.log('🗑️  Colección de mascotas limpiada');

        // Buscar un usuario existente para asignar como owner
        const user = await User.findOne();
        
        if (!user) {
            console.log('❌ No hay usuarios en la base de datos. Por favor crea un usuario primero.');
            process.exit(1);
        }

        // Asignar el usuario como owner de todas las mascotas de prueba
        const petsWithOwner = samplePets.map(pet => ({
            ...pet,
            owner: user._id
        }));

        // Insertar mascotas de prueba
        await Pet.insertMany(petsWithOwner);
        console.log(`✅ ${samplePets.length} mascotas de prueba insertadas`);

        console.log('🎉 Base de datos poblada exitosamente!');
        console.log('📱 Ahora puedes ver las mascotas en: http://localhost:3000/mascotas');
        
        process.exit(0);

    } catch (error) {
        console.error('❌ Error poblando la base de datos:', error);
        process.exit(1);
    }
}

// Ejecutar el script
seedDatabase();