const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Formulir, Notifikasi, Surat } = require("../models/index");
const { where } = require("sequelize");
var nodemailer = require('nodemailer');
const path = require('path')

const dashboard = async(req, res)=>{
  try {
    const countPermohonan = await Formulir.count({
      where: {
        acceptByAdmin :0,
        acceptByKaprodi : 0
      }
    })
    const countTerima = await Formulir.count({
      where: {
        acceptByAdmin: 1
      }
    })
    const countTolak = await Formulir.count({
      where: {
        acceptByAdmin: 2
      }
    })
    const countRiwayat = await Formulir.count({
      where: {
        acceptByAdmin:1,
        acceptByKaprodi:1
      }
    })
    const title ="Dashborad";
    res.render("admin/dashboard", {countPermohonan,countTerima,countTolak, countRiwayat,title})
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const lihatProfil = async (req, res) => {
  try {
  
    const lihatProfil = await User.findByPk(req.userId);
    const userId = lihatProfil.id;
    const userRole = lihatProfil.role;
    const userEmail = lihatProfil.email;
    const userNamaDepan = lihatProfil.nama_depan;
    const userNamaBelakang = lihatProfil.nama_belakang;
    const userProfil = lihatProfil.foto_profil;
    const userNo_Identitas = lihatProfil.no_identitas;
    const userNo_Hp = lihatProfil.no_hp;
    const userAlamat = lihatProfil.alamat;
    const title = "Profile";
    res.render("admin/profile", {
      userId,
      userRole,
      userEmail,
      userNamaDepan,
      userNamaBelakang,
      userProfil,
      userNo_Identitas,
      userNo_Hp,
      userAlamat,
      title,
    });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfilMhs = async (req, res) => {
  try {
    const { email, nama, no_identitas, no_hp, alamat } = req.body;

    console.log(req.userId);
    await User.update(
      {
        email: email,
        nama: nama,
        no_identitas: no_identitas,
        no_hp: no_hp,
        alamat: alamat,
      },
      {
        where: {
          id: req.userId,
        },
      }
    );
    res.redirect("/admin/profil");
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const aksesUpdateProfil = async (req, res) => {
  try {
    const lihatProfil = await User.findByPk(req.userId);
    const userId = lihatProfil.id;
    const userRole = lihatProfil.role;
    const userEmail = lihatProfil.email;
    const userNama = lihatProfil.nama;
    const userNo_Identitas = lihatProfil.no_identitas;
    const userNo_Hp = lihatProfil.no_hp;
    const userAlamat = lihatProfil.alamat;

    res.render("profil/editprofil", {
      userId,
      userRole,
      userEmail,
      userNama,
      userNo_Identitas,
      userNo_Hp,
      userAlamat,
    });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const lihatPersetujuan = async (req, res) => {
  try {
    const lihatPersetujuan = await Formulir.findAll({
      include: [{ model: User }],
    });
    const nomorSurat = lihatPersetujuan.nomorSurat;
    const tanggalDikirim = lihatPersetujuan.tanggalDikirim;
    const tanggalDisetujui = lihatPersetujuan.tanggalDisetujui;
    const penerima = lihatPersetujuan.penerima;
    const instansi = lihatPersetujuan.instansi;
    const acceptByAdmin = lihatPersetujuan.acceptByAdmin;
    const acceptByKaprodi = lihatPersetujuan.acceptByKaprodi;
    const judulTA = lihatPersetujuan.judulTA;
    const title = "Persetujuan";

    res.render("admin/persetujuan", {
      lihatPersetujuan,
      nomorSurat,
      tanggalDikirim,
      tanggalDisetujui,
      penerima,
      instansi,
      acceptByAdmin,
      acceptByKaprodi,
      judulTA,
      title,
    });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const lihatAkun = async (req, res) => {
  try {
    const lihatAkun = await User.findAll({});

    const title = "Akun";

    res.render("admin/akun", { lihatAkun, title });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const lihatDetail = async (req, res) => {
  try {
    const nomorSurat = req.params.nomorSurat;
    const lihatDetail = await Formulir.findOne({
      where: { nomorSurat },
      include: [{ model: User }],
    });

    const title = "Detail Formulir";

    res.render("admin/detail", { requestDetail: lihatDetail, title });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const terimaFormulir = async (req, res) => {
  try {
    const nomorSurat = req.params.nomorSurat;
    const statusFormulir = await Formulir.findOne({ where: { nomorSurat }, include: { model: User } });
    statusFormulir.update({ acceptByAdmin: 1 });
    const userId = User.id;
    const penerima = statusFormulir.User.id;
    
    
    const newNotification = await Notifikasi.create({
      nomorSurat: nomorSurat,
      tanggal: new Date(),
      isRead: false,
      penerima: penerima,

    });

    const io = req.app.get("io");
    io.emit("permintaan_formulir", {
      userId: userId,
    });
    io.emit("permintaan_formulir", {message: `Pengajuan Formulir Diterima!`,})
    res.redirect("/admin/persetujuan");
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const tolakFormulir = async (req, res) => {
  try {
    const nomorSurat = req.params.nomorSurat;
    const statusFormulir = await Formulir.findOne({ where: { nomorSurat }, include: { model: User } });
    statusFormulir.update({ acceptByAdmin: 2, acceptByKaprodi: 2 });

    const penerima = statusFormulir.User.id;

    const newNotification = await Notifikasi.create({
      nomorSurat: nomorSurat,
      tanggal: new Date(),
      isRead: false,
      penerima: penerima,
    });

    const io = req.app.get("io");
    io.emit("permintaan_formulir", {
      userId: penerima,
    });
    io.emit("permintaan_formulir", {message: "Pengajuan Formulir Ditolak!", userId: penerima})
    res.redirect("/admin/persetujuan");
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const riwayatSurat = async(req, res) => {
try {
  const riwayatSurat = await Formulir.findAll({
    include: [{ model: User},{ model: Surat}],
    where: {
      acceptByAdmin: 1,
      acceptByKaprodi: 1
    },
    
  })
  const title = "Riwayat Surat";

  res.render("admin/riwayat", { riwayatSurat: riwayatSurat, title });
  
} catch (error) {
  console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
}
 
}

const formulirDiterima = async (req,res) => {
  try {
    
    const formulirDiterima = await Formulir.findAll({
      include: [{ model: User }],
      where: {
        acceptByAdmin: 1,
      },     
    })
    const title = "Formulir yang Diterima";
    res.render("admin/diterima", {formulirDiterima, title})

  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const formulirDitolak = async (req,res) => {
  try {
    const formulirDitolak = await Formulir.findAll({
      include: [{ model: User }],
      where: {
        acceptByAdmin: 2,
      },     
    })
    const title = "Formulir yang Ditolak";
    res.render("admin/ditolak", {formulirDitolak, title})

  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const hapusSurat = async (req,res) => {
  try {
    const nomorSurat = req.params.nomorSurat;
    const hapusSurat = await Formulir.findOne ({where : {nomorSurat}});
    await Notifikasi.destroy({ where: { nomorSurat } });
    await Surat.destroy({where:{nomorSurat}})
    await hapusSurat.destroy();

    return res.redirect('/admin/riwayat');
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const riwayatSuratByTahun = async(req, res) => {
  try {
    const angkatan = req.params.angkatan;
    const riwayatSurat = await Formulir.findAll({
      include: [{ model: User, where : {angkatan : angkatan}  },{ model: Surat}],
      where: {
        acceptByAdmin: 1,
        acceptByKaprodi: 1,
      },
      
    })
    const title = "Riwayat Surat";
    res.render("admin/riwayatbytahun", { riwayatSurat: riwayatSurat, title, angkatan });
    
  } catch (error) {
    console.error("Error during login: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
   
  } 


const email = async(req,res) => {
  try {
    const nomorSurat = req.params.nomorSurat;
    const surat= await Surat.findOne({
      include: [{model: Formulir, include:[{model:User}]}],
      where:{nomorSurat}
    })

    if (!surat) {
      return res.status(404).json({ message: "Surat tidak ditemukan" });
    }

    const { Formulir: formulir, nama_file: pdfFileName } = surat;
    const { User: user } = formulir;
    const recipientEmail = user.email;

    const pdfDir = path.resolve("public", "data", "surat");
    const pdfPath = path.join(pdfDir, pdfFileName);
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Admiin.siunand@gmail.com',
        pass: 'ltdk zinr gwtq wotu'
      }
    });
    
    var mailOptions = {
      from: 'Admiin.siunand@gmail.com',
      to: recipientEmail,
      subject: 'Surat Permintaan Data Tugas Akhir Sistem Informasi ',
      text: 'Berikut surat permintaan data untuk tugas akhir yang telah disetujui.',
      attachments: [
        {
          filename: pdfFileName,
          path: pdfPath
        }
      ]
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.json({ success: true, message: "berhasil mengirim surat" });
    
  } catch (error) {
    console.error("Error during login: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
}

const lihatNotifikasi = async (req,res) => {
  try {
    const lihatNotifikasi = await Notifikasi.findAll({
      include:[{model: Formulir}],
      where: {
        penerima: 'Admin',
      },
    });
    res.render("admin/template",{notifikasi : lihatNotifikasi })
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
}

const readNotifikasi = async (req,res) => {
  try {
    const notifikasi = await Notifikasi.findByPk(req.params.id);
    
    if (notifikasi) {
      notifikasi.isRead = 1;
      await notifikasi.save();
      
      res.sendStatus(200);
    } else {
      res.status(404).send('Notifikasi tidak ditemukan');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi Kesalahan Server');
  }
}


module.exports = {
  dashboard,
  updateProfilMhs,
  lihatProfil,
  aksesUpdateProfil,
  lihatPersetujuan,
  lihatAkun,
  lihatDetail,
  terimaFormulir,
  tolakFormulir,
  riwayatSurat,
  formulirDiterima,
  formulirDitolak,
  hapusSurat,
  riwayatSuratByTahun,
  email,
  lihatNotifikasi,
  readNotifikasi
};
