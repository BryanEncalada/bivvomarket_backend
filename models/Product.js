const { sequelize } = require('../config/db');

const productoSchema = sequelize.define('Producto', {
  _id: {
    type: sequelize.Sequelize.CHAR(24),
    primaryKey: true,
    field: 'id'
  },
  img: {
    type: sequelize.Sequelize.STRING,
    allowNull: false
  },
  new: {
    type: sequelize.Sequelize.BOOLEAN,
    allowNull: false,
    field: 'nuevo'
  },
  price: {
    type: sequelize.Sequelize.DECIMAL,
    allowNull: false,
    defaultValue: 0,
    field: 'precio'
  },
  old_price: {
    type: sequelize.Sequelize.DECIMAL,
    defaultValue: 0,
    field: 'precio_anterior'
  },
  discount: {
    type: sequelize.Sequelize.INTEGER,
    defaultValue: 0,
    field: 'descuento'
  },
  status: {
    type: sequelize.Sequelize.STRING(50),
    defaultValue: 'Disponible',
    field:'estado'
  },
  quantity: {
    type: sequelize.Sequelize.INTEGER,
    defaultValue: 0,
    field: 'cantidad'
  },
  order_quantity: {
    type: sequelize.Sequelize.INTEGER,
    defaultValue: 0
  },
  weight: {
    type: sequelize.Sequelize.DECIMAL,
    defaultValue: 0,
    field: 'peso'
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