'use strict';
const {
  Model
} = require('sequelize');
const formulir = require('./formulir');
module.exports = (sequelize, DataTypes) => {
  class Surat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Surat.belongsTo(models.Formulir, {
        foreignKey : 'nomorSurat'
      })
    }
  }
  Surat.init({
    id : {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nama_file: {
      type: DataTypes.STRING
    },
    nomorSurat: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'Formulir',
        key: 'nomorSurat'
      }
    },
  }, {
    sequelize,
    modelName: 'Surat',
  });
  return Surat;
};