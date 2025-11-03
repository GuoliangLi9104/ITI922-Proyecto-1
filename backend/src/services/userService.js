const { User } = require('../models');

// ⚠️ Vulnerabilidad OWASP A02: manejo inseguro de contraseñas
exports.createUser = async (username, email, password) => {
  const user = new User({ username, email, password });
  return await user.save();
};

// ⚠️ Vulnerabilidad OWASP A07: autenticación débil (sin hashing ni tokens)
exports.authenticateUser = async (username, password) => {
  const user = await User.findOne({ username, password });
  return user || null;
};

// Obtener todos los usuarios (sin filtrado ni paginación)
exports.getAllUsers = async () => {
  return await User.find();
};
