const mongoose = require("mongoose");
require("dotenv").config();
const log = require('../logs');

const connectDB = async () => {
  try {

    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Tiempo para intentar conectar
      socketTimeoutMS: 45000,          // Timeout en sockets
      family: 4,                       // IPv4 para evitar problemas IPv6
      tls: true                       // Asegura conexión segura (TLS)
    });


    console.log("✅ Conectado a MongoDB Atlas");
    log("Conexión exitosa a MongoDB Atlas");
  } catch (err) {
    console.error("❌ Error al conectar a MongoDB:", err.message);
    log(`Error al conectar a MongoDB: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
