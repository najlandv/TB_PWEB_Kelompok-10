'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Formulir extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Formulir.init({
    nomorSurat: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    tanggalDikirim: DataTypes.DATE,
    tanggalDisetujui: DataTypes.DATE,
    penerima: DataTypes.STRING,
    instansi: DataTypes.STRING,
    acceptByAdmin:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    acceptByKaprodi:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    judulTA: DataTypes.STRING,
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