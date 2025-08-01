const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteAllProducts,
} = require("../controllers/Product.controller");

const authMiddleware = require("../middlewares/auth.middleware");

// 🟢 Rutas públicas
router.get("/", getProducts); // Obtener todos
router.get("/:id", getProductById); // Obtener uno
router.delete("/all", deleteAllProducts);

// 🔒 Rutas protegidas con token
router.post("/", authMiddleware, createProduct); // Crear producto
router.put("/:id", authMiddleware, updateProduct); // Actualizar
router.delete("/:id", authMiddleware, deleteProduct); // Eliminar

module.exports = router;
