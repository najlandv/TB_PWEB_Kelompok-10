const { Op } = require("sequelize");
const { where } = require("sequelize");
const { User, Formulir, Notifikasi } = require("../models/index");

async function lihatNotifikasi(req, res, next) {
    try {
        // Ambil notifikasi dari database
        const notifikasi = await Notifikasi.findAll({
            where:{
                [Op.or]: [{ penerima: 'Admin' }, { penerima: 'Kaprodi' }]
            },
            include: [{ model: Formulir ,include:{
                model:User
            }}],
            order: [['createdAt', 'DESC']]
        });

        // Simpan notifikasi di res.locals
        res.locals.notifikasi = notifikasi;

        // Lanjut ke middleware berikutnya
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = lihatNotifikasi;
