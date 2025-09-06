const express = require("express");
const router = express.Router();
const { enviarCorreo } = require("../controllers/correo.controller.js");



// 🔒 Rutas protegidas con token
router.post("/", enviarCorreo); // Enviar correo

module.exports = router;