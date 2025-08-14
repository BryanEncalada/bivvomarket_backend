const { sequelize } = require('../config/db');

// models/productoDetalleLista.js

const ProductoDetalleListaChema = sequelize.define('ProductoDetalleLista', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  producto_id: {
    type: sequelize.Sequelize.CHAR(24),
    allowNull: false
  },
  detalle: {
    type: sequelize.Sequelize.STRING,
    allowNull: false
  }
}, {
  tableName: 'producto_detalles_lista',
  timestamps: false
});

module.exports = { ProductoDetalleListaChema };