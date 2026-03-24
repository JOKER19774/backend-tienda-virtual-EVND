'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_productos extends Model {
    static associate(models) {
      tbc_productos.belongsTo(models.tbc_categoria, {
        as: 'categoria',
        foreignKey: 'id_categoria',
      });

      tbc_productos.hasMany(models.tbc_carrito_detalle, {
        as: 'detalles_carrito',
        foreignKey: 'id_producto',
      });
    }
  }
  tbc_productos.init({
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    id_categoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbc_productos',
    tableName: 'tbc_productos',
  });
  return tbc_productos;
};
