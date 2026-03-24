'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_carrito_detalle extends Model {
    static associate(models) {
      tbc_carrito_detalle.belongsTo(models.tbc_carrito, {
        as: 'carrito',
        foreignKey: 'id_carrito',
      });

      tbc_carrito_detalle.belongsTo(models.tbc_productos, {
        as: 'producto',
        foreignKey: 'id_producto',
      });
    }
  }
  tbc_carrito_detalle.init({
    id_carrito: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbc_carrito_detalle',
    tableName: 'tbc_carrito_detalle',
  });
  return tbc_carrito_detalle;
};
