'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Formulirs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomorSurat: {
        type: Sequelize.INTEGER
      },
      tanggalDikirim: {
        type: Sequelize.DATE
      },
      tanggalDisetujui: {
        type: Sequelize.DATE
      },
      penerima: {
        type: Sequelize.STRING
      },
      instansi: {
        type: Sequelize.STRING
      },
      acceptByAdmin: {
        type: Sequelize.BOOLEAN
      },
      acceptByKaprodi: {
        type: Sequelize.BOOLEAN
      },
      judulTA: {
        type: Sequelize.STRING
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Nama tabel User
          key: 'id'
        }
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
    await queryInterface.dropTable('Formulirs');
  }
};