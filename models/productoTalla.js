const { sequelize } = require('../config/db');

// models/productoTalla.js

  const ProductoTallaChema = sequelize.define('ProductoTalla', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    producto_id: {
      type: sequelize.Sequelize.CHAR(24),
      allowNull: false
    },
    talla: {
      type: sequelize.Sequelize.STRING(10),
      allowNull: false
    }
  }, {
    tableName: 'producto_tallas',
    timestamps: false
  });

  module.exports = { ProductoTallaChema };
