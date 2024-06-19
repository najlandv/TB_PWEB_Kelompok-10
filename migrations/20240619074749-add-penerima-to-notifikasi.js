'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Notifikasis', 
      'penerima', 
      {
        type: Sequelize.STRING, 
        allowNull: true
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Notifikasis', 'penerima');
  }
};
