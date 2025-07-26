const Product = require("../models/Product");

// Crear producto
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ mensaje: "Producto creado", producto: newProduct });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const productos = await Product.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const producto = await Product.findOne({ id: req.params.id });
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const producto = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const producto = await Product.findOneAndDelete({ id: req.params.id });
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
