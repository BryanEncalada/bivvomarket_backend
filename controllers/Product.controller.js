const { productoSchema } = require("../models/Product");
const { ProductoImagenSchema } = require("../models/productoImagen");
const {ProductoTallaChema} = require("../models/productoTalla");
const {ProductoDetalleListaChema} = require("../models/productoDetalleLista");
const { Op } = require("sequelize");

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

// 
// Obtener todos los productos
const getProducts = async (req, res) => {
  const {
    sort,
    category,
    subcategory,
    brand,
    size,
    color, // Ojo: tu tabla no tiene 'color', habría que añadirlo si es necesario
    minPrice,
    maxPrice,
  } = req.query;

  let where = {};
  let order = [];

  // Filtros
  if (category) where.parent_category = category;
  if (subcategory) where.category = subcategory;
  if (brand) where.brand = brand;
  if (size) {
    // Filtrando por talla usando relación con producto_tallas
    where["$ProductoTallas.talla$"] = size;
  }
  if (color) {
    // Si la tabla productos tuviera color
    where.color = color;
  }
  if (minPrice || maxPrice) {
    where.precio = {};
    if (minPrice) where.precio[Op.gte] = Number(minPrice);
    if (maxPrice) where.precio[Op.lte] = Number(maxPrice);
  }

  // Ordenamiento
  switch (sort) {
    case "price_asc":
      order = [["precio", "ASC"]];
      break;
    case "price_desc":
      order = [["precio", "DESC"]];
      break;
    case "id_asc":
      order = [["id", "ASC"]];
      break;
    case "id_desc":
      order = [["id", "DESC"]];
      break;
    case "discount":
      where.descuento = { [Op.gt]: 0 };
      break;
    default:
      order = [];
  }

  try {
    const products = await productoSchema.findAll({
      where,
      include: [
        { model: ProductoImagenSchema, as: 'imagenes' },
        { model: ProductoTallaChema, as: 'tallas' },
        { model: ProductoDetalleListaChema, as: 'detallesLista' }
      ],
      order,
    });

    res.json(products);
  } catch (error) {
    console.error(error);
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
