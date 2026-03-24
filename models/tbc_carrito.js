'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tbc_carrito extends Model {
    static associate(models) {
      tbc_carrito.belongsTo(models.tbc_usuarios, {
        as: 'usuario',
        foreignKey: 'id_usuario',
      });

      tbc_carrito.hasMany(models.tbc_carrito_detalle, {
        as: 'detalles',
        foreignKey: 'id_carrito',
      });
    }
  }
  tbc_carrito.init({
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'activo'
    }
  }, {
    sequelize,
    modelName: 'tbc_carrito',
    tableName: 'tbc_carritos',
  });
  return tbc_carrito;
};
