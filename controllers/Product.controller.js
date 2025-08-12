const Product = require("../models/Product");
const log = require('../logs');

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
  const {
    sort,
    category,
    subcategory,
    brand,
    size,
    color,
    minPrice,
    maxPrice,
  } = req.query;

  let filter = {};
  let sortOptions = {};

  if (category) filter.parentCategory = category;
  if (subcategory) filter.category = subcategory;
  if (brand) filter.brand = brand;
  if (size) filter.sizes = size;
  if (color) filter.color = color;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  switch (sort) {
    case "price_asc":
      sortOptions = { price: 1 };
      break;
    case "price_desc":
      sortOptions = { price: -1 };
      break;
    case "id_asc":
      sortOptions = { _id: 1 };
      break;
    case "id_desc":
      sortOptions = { _id: -1 };
      break;
    case "discount":
      filter.discount = { $gt: 0 };
      break;
    default:
      sortOptions = {};
  }

  try {

    const products = await Product.find(filter).sort(sortOptions);
    res.json(products);
  } catch (error) {

    log(error);

    res.status(500).json({ error: error.message });
  }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const producto = await Product.findById(req.params.id);
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    log(error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar producto
const updateProduct = async (req, res) => {
  try {
    const producto = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!producto)
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    log(error);
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

const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "Todos los productos fueron eliminados." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar productos." });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
};
