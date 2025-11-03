const { Product } = require('../models');

// Crear producto (⚠️ Vulnerable: sin sanitizar campos)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ message: 'Producto creado', product });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    // ⚠️ Vulnerable: consulta directa sin filtros sanitizados
    const products = await Product.find(req.query);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar productos' });
  }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Producto actualizado', updated });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
