const express = require("express");
const app = express();
require("dotenv").config();

const connectDB = require("./config/db");

// Conectarse a MongoDB
connectDB();

// Middleware para leer JSON
app.use(express.json());

// Rutas de productos
const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

const categoryRoutes = require("./routes/category.routes");
app.use("/api/categories", categoryRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando y conectada a MongoDB");
});

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
