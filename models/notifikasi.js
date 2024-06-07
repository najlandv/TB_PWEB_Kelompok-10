'use strict';
const {Model} = require('sequelize');
const formulir = require('./formulir');

module.exports = (sequelize, DataTypes) => {
  class Notifikasi extends Model {

    static associate(models) {
      // define association here
      Notifikasi.belongsTo(models.Formulir, {
        foreignKey : 'nomorSurat'
      })
    }
  }
  Notifikasi.init({
    nomorSurat: {
      type :DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tanggal: {
      type : DataTypes.DATE
    },
    isRead: {
      type : DataTypes.BOOLEAN
    }
  }, {
    sequelize,
    modelName: 'Notifikasi',
  });
  return Notifikasi;
};