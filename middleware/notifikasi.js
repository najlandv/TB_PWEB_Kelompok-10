const { Op } = require("sequelize");
const { where } = require("sequelize");
const { User, Formulir, Notifikasi } = require("../models/index");

async function lihatNotifikasi(req, res, next) {
    try {
        const notifikasi = await Notifikasi.findAll({
            where:{penerima:'Admin'},
            include: [{ model: Formulir ,include:{
                model:User
            }}],
            order: [['createdAt', 'DESC']]
        });

        res.locals.notifikasi = notifikasi;
        
        next();
    } catch (error) {
        next(error);
    }

    

}


module.exports = lihatNotifikasi;
