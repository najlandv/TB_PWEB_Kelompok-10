const bcrypt = require('bcrypt');
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
     await queryInterface.bulkInsert('Users', [{
         email: 'admin@gmail.com',
         password: await bcrypt.hash('admin123', 10),
         role: 'admin',
         nama: 'Admin',
         no_identitas : '-',
         no_hp : '0856468654',
         alamat : 'Sistem Informasi Universitas Andalas',
         createdAt: new Date(),
         updatedAt: new Date(),
       },
       {
         email: 'kaprodi@gmail.com',
         password: await bcrypt.hash('kaprodiSI', 10),
         role: 'kaprodi',
         nama: 'Kaprodi Sistem Informasi',
         no_identitas : '192736453',
         no_hp : '0859873452',
         alamat : 'Padang',
         createdAt: new Date(),
         updatedAt: new Date(),
       },
       {
        email: '2211521004_nadia@student.unand.ac.id',
        password: await bcrypt.hash('2211521004',10),
        role:'mahasiswa',
        nama: 'Nadia Deari Hanifah',
        no_identitas : '2211521004',
        no_hp : '083124517280',
        alamat : 'Payakumbuh',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: '2211521006_najla@student.unand.ac.id',
        password: await bcrypt.hash('2211521006',10),
        role:'mahasiswa',
        nama: 'Najla Nadiva',
        no_identitas : '2211521006',
        no_hp : '082284059950',
        alamat : 'Bukittinggi',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        email: '2211523006_mahira@student.unand.ac.id',
        password: await bcrypt.hash('2211523006',10),
        role:'mahasiswa',
        nama: 'Sisri Mahira',
        no_identitas : '2211523006',
        no_hp : '0839283745',
        alamat : 'Padang',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
   
   ],{});
     
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('Users', null, {});
  }
};