"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      nama_depan: DataTypes.STRING,
      nama_belakang: DataTypes.STRING,
      foto_profil : DataTypes.STRING,
      no_identitas: DataTypes.STRING,
      no_hp: DataTypes.STRING,
      alamat: DataTypes.STRING,
      angkatan : DataTypes.STRING,
    
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};