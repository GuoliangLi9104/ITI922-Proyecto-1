// controllers/userController.js
const mongoose = require('mongoose');
const bcrypt = (() => {
  try { return require('bcryptjs'); } catch (e) { return null; }
})();
const { User } = require('../models');

// Registro - ahora con hashing si bcrypt está disponible
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'username, email y password requeridos' });

    // Validación mínima de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Email inválido' });

    // Verificar existencia
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ error: 'Usuario o correo ya registrado' });

    let finalPassword = password;
    if (bcrypt) {
      const salt = await bcrypt.genSalt(10);
      finalPassword = await bcrypt.hash(password, salt);
    } else {
      console.warn('bcryptjs no instalado: registrando sin hash (recomendado instalar bcryptjs)');
    }

    const newUser = new User({ username, email, password: finalPassword });
    await newUser.save();
    // No devolver password en la respuesta
    const userSafe = newUser.toObject();
    delete userSafe.password;
    res.status(201).json({ message: 'Usuario registrado', user: userSafe });
  } catch (error) {
    console.error('register error:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

// Login - compara hash si bcrypt disponible, sino compara plano
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username y password requeridos' });

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });

    if (bcrypt) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });
    } else {
      // fallback inseguro
      if (password !== user.password) return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const userSafe = user.toObject();
    delete userSafe.password;
    res.json({ message: 'Inicio de sesión exitoso', user: userSafe });
  } catch (error) {
    console.error('login error:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('getAllUsers error:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};

// Obtener un usuario por id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
};

// Actualizar usuario (no devuelve password)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.password) {
      if (bcrypt) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);
      } else {
        console.warn('bcryptjs no instalado: actualizando password sin hash (recomendado instalar bcryptjs)');
      }
    }
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const updated = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
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
