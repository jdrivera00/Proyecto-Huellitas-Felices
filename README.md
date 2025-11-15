# 🐾 Huellitas Felices

Plataforma web para adopción de mascotas, donaciones y reporte de animales perdidos.

## 🚀 Características

- **🐕 Adopción de Mascotas**: Publica y busca mascotas para adopción
- **💝 Sistema de Donaciones**: Donaciones con tokens virtuales a fundaciones
- **🗺️ Mapa Interactivo**: Reporta y encuentra mascotas perdidas
- **👤 Sistema de Usuarios**: Registro, login y perfiles personalizados
- **🖼️ Subida de Imágenes**: Para mascotas y reportes

## 🛠️ Tecnologías

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB Atlas
- **Frontend**: EJS, CSS, JavaScript
- **Autenticación**: Sessions + bcrypt
- **Subida de archivos**: Multer
- **Mapa**: Leaflet + OpenStreetMap

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/huellitas-felices.git
cd huellitas-felices
```

2. Instala dependencias:

```bash
npm install
```

3. Configura las variables de entorno:

```bash
cp .env.example .env
# Edita .env con tus configuraciones
```

4. Inicia el servidor:

```bash
npm run dev
```


## 🔧 Configuración

Crea un archivo .env con las siguientes variables:

MONGODB_URI=tu_cadena_conexion_mongodb_atlas
SESSION_SECRET=tu_secreto_sesion
PORT=3000


## 👥 Equipo de Desarrollo
Juan David Rivera Barona - Fundador y Desarrollador

Jose David Molina Delgado - Desarrollador

Julio Cesar Madera Carvajal - Desarrollador


## 📄 Licencia
Este proyecto es desarrollado para fines educativos en la Universidad Santiago de Cali.
