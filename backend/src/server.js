// server.js
require('dotenv').config({ path: './.env' });
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const routes = require('./routes');
const cors = require('cors');

const app = express();

// ==============================
// 🔗 Conexión a MongoDB
// ==============================
connectDB();
console.log('🔍 MONGO_URI actual:', process.env.MONGO_URI);

// ==============================
// ⚙️ Middlewares base
// ==============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==============================
// 🖼️ Servir carpeta de imágenes locales
// ==============================
// Esto hace que se pueda acceder a:
// http://localhost:3000/uploads/products/archivo.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==============================
// 🚀 Ruta base de prueba
// ==============================
app.get('/', (req, res) => {
  res.send('🚀 Servidor funcionando y conectado a MongoDB Atlas');
});

// ==============================
// 📦 Rutas API
// ==============================
app.use('/api', routes);

// ==============================
// 🧩 Prueba de modelo User
// ==============================
const { User } = require('./models');
User.find().then(users => console.log('Usuarios en BD:', users.length)).catch(err => {
  console.error('❌ Error consultando usuarios:', err.message);
});

// ==============================
// 🌐 Puerto del servidor
// ==============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`)
);
