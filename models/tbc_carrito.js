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
    estado: {
      type: DataTypes.ENUM('pendiente', 'pagado'),
      allowNull: false,
      defaultValue: 'pendiente'
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'tbc_carrito',
    tableName: 'tbc_carritos',
  });
  return tbc_carrito;
};
