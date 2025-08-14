const { sequelize } = require('../config/db');

// models/productoImagen.js

const ProductoImagenSchema = sequelize.define('ProductoImagen', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  producto_id: {
    type: sequelize.Sequelize.CHAR(24),
    allowNull: false
  },
  imagen: {
    type: sequelize.Sequelize.STRING,
    allowNull: false
  }
}, {
  tableName: 'producto_imagenes',
  timestamps: false
});

// ProductoImagenSchema.associate = models => {
//   ProductoImagenSchema.belongsTo(models.Producto, { foreignKey: 'producto_id', as: 'producto' });
// };

module.exports = { ProductoImagenSchema }; 