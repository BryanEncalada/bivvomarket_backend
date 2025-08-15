const { sequelize } = require('../config/db');

const userSchema = sequelize.define('Usuarios',
  {
    id: {
      type: sequelize.Sequelize.CHAR(24),
      primaryKey: true,
      allowNull: false
    },
    email: {
      type: sequelize.Sequelize.STRING(255),
      allowNull: false
    },
    password: {
      type: sequelize.Sequelize.STRING(255),
      allowNull: false
    },
    apellido: {
      type: sequelize.Sequelize.STRING(100),
      allowNull: true
    },
    nombre: {
      type: sequelize.Sequelize.STRING(100),
      allowNull: true
    },
    rol: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: 'usuarios',
    timestamps: false,
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.password) {
          usuario.password = await bcrypt.hash(usuario.password, 10);
        }
      },
      beforeUpdate: async (usuario) => {
        if (usuario.changed("password")) {
          usuario.password = await bcrypt.hash(usuario.password, 10);
        }
      },
    }
  });

// Encriptar la contraseña antes de guardar
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const bcrypt = require("bcryptjs");
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

  module.exports = { userSchema };
