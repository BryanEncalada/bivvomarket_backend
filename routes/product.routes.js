const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/Product.controller");

const authMiddleware = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.post("/", createProduct); // Crear producto
router.get("/", getProducts); // Obtener todos
router.get("/:id", getProductById); // Obtener uno
router.put("/:id", updateProduct); // Actualizar
router.delete("/:id", deleteProduct); // Eliminar

module.exports = router;
