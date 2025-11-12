// controllers/userController.js
const mongoose = require('mongoose');
const { User } = require('../models');

// Registro inseguro: guarda password en texto plano para recrear la vulnerabilidad
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'username, email y password requeridos' });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ error: 'Usuario o correo ya registrado' });

    // 🔴 Se omite hashing deliberadamente para fines académicos
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado sin cifrado', user: newUser });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login vulnerable: permite operadores MongoDB en username/password (NoSQLi)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username y password requeridos' });

    // 🔴 Consulta vulnerable: sin sanitización permite { "$ne": null }
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    res.json({ message: 'Inicio de sesión exitoso', user });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener todos los usuarios (incluye password en texto plano)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por id (sin ocultar password)
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualizar usuario (password se guarda tal cual llegue en el body)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario actualizado', user: updated });
  } catch (error) {
    console.error('updateUser error:', error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('deleteUser error:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
};
