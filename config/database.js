const { Sequelize } = require('sequelize');

const db = new Sequelize('tb_pweb', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

module.exports = db;