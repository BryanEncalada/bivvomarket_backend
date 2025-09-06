const { productoSchema } = require("../models/Product");
const { ProductoImagenSchema } = require("../models/productoImagen");
const { ProductoTallaChema } = require("../models/productoTalla");
const { ProductoDetalleListaChema } = require("../models/productoDetalleLista");
const { Op } = require("sequelize");
const { sequelize } = require('../config/db');

const log = require('../logs');
const crypto = require("crypto"); 

function objectIdLike() {
  return crypto.randomBytes(12).toString("hex");
}

//------------------------------------------------------------------------------------
// Crear producto
// Insertar producto
const createProduct = async (req, res) => {
  const t = await sequelize.transaction();

  let data = req.body;

  // Si el producto tiene _id = 0 → genera uno nuevo
  if (!data._id || data._id === "0" || data._id === 0) {
    data._id = objectIdLike();
  }

  try {
    // Paso 1: crear el producto principal
    const producto = await productoSchema.create(req.body, { transaction: t });

    // Paso 2: insertar imágenes si existen
    if (req.body.imagenes && req.body.imagenes.length > 0) {
      await ProductoImagenSchema.bulkCreate(
        req.body.imagenes.map(img => ({
          ...img,
          producto_id: producto._id
        })),
        { transaction: t }
      );
    }

    // Paso 3: insertar detalles si existen
    if (req.body.detallesLista && req.body.detallesLista.length > 0) {
      await ProductoDetalleListaChema.bulkCreate(
        req.body.detallesLista.map(d => ({
          detalle: d,
          producto_id: producto._id
        })),
        { transaction: t }
      );
    }

    // Paso 4: insertar tallas si existen
    if (req.body.tallas && req.body.tallas.length > 0) {
      await ProductoTallaChema.bulkCreate(
        req.body.tallas.map(d => ({
          talla: d,
          producto_id: producto._id
        })),
        { transaction: t }
      );
    }

    // Confirmar transacción
    await t.commit();

    // Traer el producto con las relaciones creadas
    const productoCreado = await productoSchema.findByPk(producto._id, {
      include: [
        { model: ProductoImagenSchema, as: 'imagenes' },
        { model: ProductoTallaChema, as: 'tallas' },
        { model: ProductoDetalleListaChema, as: 'detallesLista' }
      ]
    });

    res.status(201).json({
      mensaje: "Producto creado",
      producto: productoCreado
    });

  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};


//------------------------------------------------------------------------------------
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

    const response = products.map(producto => {
      const p = producto.toJSON(); // convierte instancia a objeto plano
      p.price = parseFloat(p.price);
      p.old_price = parseFloat(p.old_price);
      p.weight = parseFloat(p.weight);
      return p;
    }).sort((a, b) => {
      // primero ordena por categoría
      const categoryCompare = a.parent_category.localeCompare(b.parent_category);
      if (categoryCompare !== 0) {
        return categoryCompare;
      }
      // si la categoría es la misma, ordena por order_quantity
      return a.order_quantity - b.order_quantity;
    });

    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//------------------------------------------------------------------------------------
// Obtener producto por ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await productoSchema.findByPk(id, {
      include: [
        { model: ProductoImagenSchema, as: 'imagenes' },
        { model: ProductoTallaChema, as: 'tallas' },
        { model: ProductoDetalleListaChema, as: 'detallesLista' }
      ]
    });

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//------------------------------------------------------------------------------------
// Actualizar producto
const updateProduct = async (req, res) => {

  const t = await sequelize.transaction();

  try {

    // Paso 1: buscar el producto
    const producto = await productoSchema.findByPk(req.params.id);

    //console.log('productoUpdate', producto);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Paso 2: actualizar y obtener el registro actualizado
    await producto.update(req.body, { transaction: t });

    if (req.body.imagenes) {



      // 1. Eliminar las imágenes antiguas
      await ProductoImagenSchema.destroy({ where: { producto_id: producto._id }, transaction: t });

      // 2. Crear las nuevas imágenes
      await ProductoImagenSchema.bulkCreate(
        req.body.imagenes.map(img => ({ ...img, producto_id: producto._id })), { transaction: t });

    }

    if (req.body.detallesLista) {


      // 1. Eliminar los detalles
      await ProductoDetalleListaChema.destroy({ where: { producto_id: producto._id }, transaction: t });

      // 2. Crear los nuevos detalles
      await ProductoDetalleListaChema.bulkCreate(
        req.body.detallesLista.map(d => ({ detalle: d, producto_id: producto._id })), { transaction: t });

    }


    if (req.body.tallas) {


      // 1. Eliminar los detalles
      await ProductoTallaChema.destroy({ where: { producto_id: producto._id }, transaction: t });

      // 2. Crear los nuevos detalles
      await ProductoTallaChema.bulkCreate(
        req.body.tallas.map(d => ({ talla: d, producto_id: producto._id })), { transaction: t });

    }

    // Confirmar transacción
    await t.commit();

    // Devolver producto con relaciones actualizadas
    const productoActualizado = await productoSchema.findByPk(producto._id, {
      include: [
        { model: ProductoImagenSchema, as: 'imagenes' },
        { model: ProductoTallaChema, as: 'tallas' },
        { model: ProductoDetalleListaChema, as: 'detallesLista' }
      ]
    });

    res.json({ mensaje: "Producto actualizado", producto: productoActualizado });

  } catch (error) {
    log(error);
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

//------------------------------------------------------------------------------------
// Eliminar producto
const deleteProduct = async (req, res) => {
  try {
    const producto = await productoSchema.findByPk(req.params.id);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    // Borrar hijos primero
    await ProductoImagenSchema.destroy({ where: { producto_id: producto._id } });
    await ProductoTallaChema.destroy({ where: { producto_id: producto._id } });
    await ProductoDetalleListaChema.destroy({ where: { producto_id: producto._id } });

    // Luego borrar el producto
    await producto.destroy();



    res.json({ mensaje: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//------------------------------------------------------------------------------------
const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: "Todos los productos fueron eliminados." });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar productos." });
  }
};

//------------------------------------------------------------------------------------
// Actualizar producto
const cambiarEstado = async (req, res) => {

  const t = await sequelize.transaction();

  try { 

    // Paso 1: buscar el producto
    const producto = await productoSchema.findByPk(req.params.id);

    //console.log('productoUpdate', producto);

    if (!producto) {
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    }

    let estado = ''
    if (producto.status == 'Disponible') {
      estado = 'Inactivo';
    }
    else {
      estado = 'Disponible';
    }

    // Paso 2: actualizar y obtener el registro actualizado
    await producto.update(
      { status: estado },
      { transaction: t }

    );


    // Confirmar transacción
    await t.commit();

    // Devolver producto con relaciones actualizadas
    const productoActualizado = await productoSchema.findByPk(producto._id, {
      include: [
        { model: ProductoImagenSchema, as: 'imagenes' },
        { model: ProductoTallaChema, as: 'tallas' },
        { model: ProductoDetalleListaChema, as: 'detallesLista' }
      ]
    });

    res.json({ mensaje: "Producto actualizado", producto: productoActualizado });

  } catch (error) {
    log(error);
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
  cambiarEstado
};
