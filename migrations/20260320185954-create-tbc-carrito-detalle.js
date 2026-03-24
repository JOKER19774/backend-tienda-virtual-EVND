'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbc_carrito_detalle', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_carrito: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tbc_carritos',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      id_producto: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tbc_productos',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      cantidad: {
        allowNull: false,
        defaultValue: 1,
        type: Sequelize.INTEGER
      },
      precio_unitario: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbc_carrito_detalle');
  }
};
