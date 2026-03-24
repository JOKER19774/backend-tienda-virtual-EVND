'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tbc_productos', 'id_categoria', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addConstraint('tbc_productos', {
      fields: ['id_categoria'],
      type: 'foreign key',
      name: 'fk_tbc_productos_id_categoria',
      references: {
        table: 'tbc_categoria',
        field: 'id',
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('tbc_productos', 'fk_tbc_productos_id_categoria');
  }
};
