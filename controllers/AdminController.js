const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User, Formulir, Notifikasi } = require("../models/index");
const { where } = require("sequelize");
var nodemailer = require('nodemailer');

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
    // console.log(req.userId);
    // res.json(req.user)
    const lihatProfil = await User.findByPk(req.userId);
    // console.log(lihatProfil);
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
    // res.json(req.user)
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
    console.log(lihatProfil);
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
    // console.log(lihatPersetujuan);
    // return res.json(lihatPersetujuan)
    const nomorSurat = lihatPersetujuan.nomorSurat;
    const tanggalDikirim = lihatPersetujuan.tanggalDikirim;
    const tanggalDisetujui = lihatPersetujuan.tanggalDisetujui;
    const penerima = lihatPersetujuan.penerima;
    const instansi = lihatPersetujuan.instansi;
    const acceptByAdmin = lihatPersetujuan.acceptByAdmin;
    const acceptByKaprodi = lihatPersetujuan.acceptByKaprodi;
    const judulTA = lihatPersetujuan.judulTA;
    const title = "Persetujuan";
    // console.log(lihatPersetujuan);

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
    // console.log(lihatAkun);
    // return res.json(lihatAkun);

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
    // console.log(lihatDetail);
    // return res.json(lihatDetail)

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
    const statusFormulir = await Formulir.findOne({ where: { nomorSurat } });
    statusFormulir.update({ acceptByAdmin: 1 });
    const namaPengirim = await User.findByPk(req.userId);

    const newNotification = await Notifikasi.create({
      nomorSurat: nomorSurat,
      tanggal: new Date(),
      isRead: false,
    });
    console.log(newNotification);

    const io = req.app.get('io');
    io.emit('confirmation_form', {
      message: 'Surat Anda Telah Diterima Admin!',
      formulir: {
        namaPengirim: namaPengirim.nama_depan,
        nim: namaPengirim.no_identitas,
        tanggalDikirim: new Date(),
      },
      
    });


    res.redirect("/admin/persetujuan");
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const tolakFormulir = async (req, res) => {
  try {
    const nomorSurat = req.params.nomorSurat;
    const statusFormulir = await Formulir.findOne({ where: { nomorSurat } });
    statusFormulir.update({ acceptByAdmin: 2, acceptByKaprodi: 2 });
    res.redirect("/admin/persetujuan");
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const riwayatSurat = async(req, res) => {
try {
  const riwayatSurat = await Formulir.findAll({
    include: [{ model: User }],
    where: {
      acceptByAdmin: 1,
      acceptByKaprodi: 1
    },
    
  })
  const title = "Riwayat Surat";
  // console.log(riwayatSurat)
  res.render("admin/riwayat", { riwayatSurat: riwayatSurat, title });
  // return res.json(riwayatSurat)
  
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
    console.log(formulirDiterima);
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
    console.log(formulirDitolak);
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
    await hapusSurat.destroy();

    return res.redirect('/admin/riwayat');
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const riwayatSuratByTahun = async(req, res) => {
  console.log(req.params);
  try {
    const angkatan = req.params.angkatan;
    const riwayatSurat = await Formulir.findAll({
      include: [{ model: User, where : {angkatan : angkatan}  }],
      where: {
        acceptByAdmin: 1,
        acceptByKaprodi: 1,
      },
      
    })
    const title = "Riwayat Surat";
    // console.log(riwayatSurat)
    res.render("admin/riwayatbytahun", { riwayatSurat: riwayatSurat, title, angkatan });
    // return res.json(riwayatSurat)
    
  } catch (error) {
    console.error("Error during login: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
   
  } 

const email = async(req,res) => {
  try {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'Admiin.siunand@gmail.com',
        pass: 'ltdk zinr gwtq wotu'
      }
    });
    
    var mailOptions = {
      from: 'Admiin.siunand@gmail.com',
      to: '2211521004_nadia@student.unand.ac.id',
      subject: 'Surat Permintaan Data',
      text: 'Meisa gilo bana bana bana'
    };
    
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.json({succes: "berhasil mengirim surat"})
    
  } catch (error) {
    console.error("Error during login: ", error);
      res.status(500).json({ message: "Internal server error" });
  }
}

const lihatNotifikasi = async (req,res) => {
  console.log(lihatNotifikasi)
  try {
    const lihatNotifikasi = await Notifikasi.findAll({
      include:[{model: Formulir}]
    });
    res.render("admin/template",{notifikasi : lihatNotifikasi })
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
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
  lihatNotifikasi
};
