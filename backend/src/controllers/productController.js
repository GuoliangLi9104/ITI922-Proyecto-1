// controllers/productController.js
const mongoose = require('mongoose');
const { Product } = require('../models');

// Crear producto (sanitiza campos básicos)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description } = req.body;
    if (!name || typeof price === 'undefined') return res.status(400).json({ error: 'name y price requeridos' });
    const product = new Product({ name, price, stock: stock || 0, description });
    await product.save();
    res.status(201).json({ message: 'Producto creado', product });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Obtener todos los productos (acepta filtros controlados)
exports.getProducts = async (req, res) => {
  try {
    // Permitir filtros limitados (por ejemplo: category, minPrice, maxPrice)
    const { category, minPrice, maxPrice, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    if (q) filter.name = { $regex: q, $options: 'i' }; // búsqueda simple
    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ error: 'Error al listar productos' });
  }
};

// Obtener producto por id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    console.error('getProductById error:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const allowed = ['name', 'price', 'stock', 'description', 'category'];
    const updates = {};
    for (const k of allowed) if (k in req.body) updates[k] = req.body[k];
    const updated = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto actualizado', product: updated });
  } catch (error) {
    console.error('updateProduct error:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('deleteProduct error:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
