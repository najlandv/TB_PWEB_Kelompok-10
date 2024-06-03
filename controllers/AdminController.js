const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const { Formulir } = require("../models/index");
const { where } = require("sequelize");


const lihatProfil = async (req, res) => {
  try {
    console.log(req.userId);
    // res.json(req.user)
    const lihatProfil = await User.findByPk(req.userId);
    console.log(lihatProfil);
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
    console.log(lihatPersetujuan);
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
    console.log(lihatPersetujuan);

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
    console.log(lihatAkun);
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
    console.log(lihatDetail);
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
  console.log(riwayatSurat)
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


module.exports = {
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
  formulirDitolak
};
