const express = require("express");
const router = express.Router();
const { subirFtp } = require("../controllers/ftp.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");

const upload = multer({ dest: "uploads/" }); // Carpeta temporal

// 🔒 Rutas protegidas con token
router.post("/", authMiddleware, upload.single("imagen"), subirFtp); // Crear producto

module.exports = router;
