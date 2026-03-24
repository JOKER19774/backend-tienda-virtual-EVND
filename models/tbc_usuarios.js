'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_usuarios extends Model {
    static associate(models) {
      tbc_usuarios.hasMany(models.tbc_carrito, {
        as: 'carritos',
        foreignKey: 'id_usuario',
      });
    }
  }
  tbc_usuarios.init({
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'cliente'
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'tbc_usuarios',
    tableName: 'tbc_usuarios',
  });
  return tbc_usuarios;
};
