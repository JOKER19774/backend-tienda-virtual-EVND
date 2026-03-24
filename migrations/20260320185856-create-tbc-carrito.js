'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbc_carritos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_usuario: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'tbc_usuarios',
          key: 'id'
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION'
      },
      total: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.DECIMAL(10, 2)
      },
      fecha_creacion: {
        allowNull: false,
        type: Sequelize.DATE
      },
      estado: {
        allowNull: false,
        defaultValue: 'activo',
        type: Sequelize.STRING(50)
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
    await queryInterface.dropTable('tbc_carritos');
  }
};
