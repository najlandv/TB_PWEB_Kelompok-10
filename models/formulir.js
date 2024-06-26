'use strict';
const {Model} = require('sequelize');
const UserModel = require('./UserModel');
const surat = require('./surat')
module.exports = (sequelize, DataTypes) => {
  class Formulir extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Formulir.belongsTo(models.User, {
        foreignKey : 'id_user'
      }),
      Formulir.hasOne(models.Surat,{
        foreignKey:'nomorSurat'
      })
    }
  }
  Formulir.init({

    nomorSurat: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    tanggalDikirim: {
      type: DataTypes.DATE
    },
    tanggalDisetujui: {
      type : DataTypes.DATE
    },
    penerima: {
      type : DataTypes.STRING
    },
    instansi: {
      type : DataTypes.STRING
    },
    acceptByAdmin:{
      type: DataTypes.INTEGER,
      defaultValue: false
    },
    acceptByKaprodi:{
      type: DataTypes.INTEGER,
      defaultValue: false
    },
    judulTA: {
      type : DataTypes.STRING
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Formulir',
  });
  return Formulir;
};