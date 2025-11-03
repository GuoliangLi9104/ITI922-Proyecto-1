require('dotenv').config({ path: './.env' });
console.log('🔍 MONGO_URI actual:', process.env.MONGO_URI);
const express = require('express');
const connectDB = require('./config/db');

const app = express();
const routes = require('./routes');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a MongoDB
connectDB();

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Servidor funcionando y conectado a MongoDB Atlas');
});

// Rutas API
app.use('/api', routes);

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor corriendo en http://localhost:${PORT}`));

const { User } = require('./models');

// Probar conexión al modelo
User.find().then(users => console.log('Usuarios en BD:', users.length));
