const { sequelize } = require('../config/db');

const productoSchema = sequelize.define('Producto', {
  id: {
    type: sequelize.Sequelize.CHAR(24),
    primaryKey: true
  },
  img: {
    type: sequelize.Sequelize.STRING,
    allowNull: false
  },
  nuevo: {
    type: sequelize.Sequelize.BOOLEAN,
    allowNull: false
  },
  precio: {
    type: sequelize.Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  precio_anterior: {
    type: sequelize.Sequelize.DECIMAL(10, 2),
    defaultValue: 0
  },
  descuento: {
    type: sequelize.Sequelize.INTEGER,
    defaultValue: 0
  },
  estado: {
    type: sequelize.Sequelize.STRING(50),
    defaultValue: 'Disponible'
  },
  cantidad: {
    type: sequelize.Sequelize.INTEGER,
    defaultValue: 0
  },
  order_quantity: {
    type: sequelize.Sequelize.INTEGER,
    defaultValue: 0
  },
  peso: {
    type: sequelize.Sequelize.DECIMAL(10, 2),
    defaultValue: 0
  },
  thumb_img: {
    type: sequelize.Sequelize.STRING
  },
  sm_desc: {
    type: sequelize.Sequelize.TEXT
  },
  parent_category: {
    type: sequelize.Sequelize.STRING(100)
  },
  category: {
    type: sequelize.Sequelize.STRING(100)
  },
  brand: {
    type: sequelize.Sequelize.STRING(100)
  },
  title: {
    type: sequelize.Sequelize.STRING(255),
    allowNull: false
  },
  details_text: {
    type: sequelize.Sequelize.TEXT
  },
  details_text_2: {
    type: sequelize.Sequelize.TEXT
  }
}, {
  tableName: 'productos',
  timestamps: false
});

// productoSchema.associate = models => {
//   Producto.hasMany(models.ProductoImagen, { foreignKey: 'producto_id', as: 'imagenes' });
//   Producto.hasMany(models.ProductoTalla, { foreignKey: 'producto_id', as: 'tallas' });
//   Producto.hasMany(models.ProductoDetalleLista, { foreignKey: 'producto_id', as: 'detallesLista' });
// };

module.exports = { productoSchema };