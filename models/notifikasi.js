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
    id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nomorSurat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Formulir',
        key: 'nomorSurat'
      }
    },
    tanggal: {
      type : DataTypes.DATE
    },
    isRead: {
      type : DataTypes.BOOLEAN
    },
    penerima: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt:{
      type : DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'Notifikasi',
  });
  return Notifikasi;
};