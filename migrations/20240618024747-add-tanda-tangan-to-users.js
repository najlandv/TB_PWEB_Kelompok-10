'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'tanda_tangan', {
      type: Sequelize.STRING,
      allowNull: true 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'tanda_tangan');
  }
};
