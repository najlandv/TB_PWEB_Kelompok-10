const { where } = require("sequelize");
const { User, Formulir, Notifikasi } = require("../models/index");

async function showNotification(req, res, next) {
    try {
        // const userId = req.user.id;
        // Ambil notifikasi dari database
        const notifikasimhs = await Notifikasi.findAll({
            where:{penerima: 4},
            include: [{ model: Formulir ,include:{
                model:User
            }}],
            order: [['createdAt', 'DESC']]
        });

        // Simpan notifikasi di res.locals
        res.locals.notifikasimhs = notifikasimhs;

        // Lanjut ke middleware berikutnya
        next();
    } catch (error) {
        next(error);
    }



}


module.exports = showNotification;
