// controllers/productController.js
const mongoose = require('mongoose');
const path = require('path');
const { Product } = require('../models');

// Crear producto con imagen local
exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock, description, category } = req.body;
    if (!name || typeof price === 'undefined') {
      return res.status(400).json({ error: 'name y price requeridos' });
    }

    // Si se subió imagen, guarda solo el nombre del archivo
    const imageName = req.file ? req.file.filename : 'default.jpg';

    const product = new Product({
      name,
      price,
      stock: stock || 0,
      description,
      category,
      image: imageName // guardamos solo el nombre
    });

    await product.save();
    res.status(201).json({ message: 'Producto creado', product });
  } catch (error) {
    console.error('createProduct error:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (minPrice) filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    if (q) filter.name = { $regex: q, $options: 'i' };

    const products = await Product.find(filter);

    // Agregar URL pública a cada imagen
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/products/`;
    const result = products.map(p => ({
      ...p.toObject(),
      imageUrl: baseUrl + p.image
    }));

    res.json(result);
  } catch (error) {
    console.error('getProducts error:', error);
    res.status(500).json({ error: 'Error al listar productos' });
  }
};

// Obtener producto por ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ error: 'ID inválido' });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/products/`;
    const productWithUrl = {
      ...product.toObject(),
      imageUrl: baseUrl + product.image
    };

    res.json(productWithUrl);
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

    // Si hay nueva imagen, reemplázala
    if (req.file) updates.image = req.file.filename;

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
