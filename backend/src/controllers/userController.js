const { User } = require('../models');

// ⚠️ Vulnerable: no se valida formato de correo ni se cifra contraseña
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado (vulnerable)', user: newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// ⚠️ Vulnerable: autenticación sin hashing
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
    res.json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
