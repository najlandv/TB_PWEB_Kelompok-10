const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const { Formulir } = require("../models/index");
const { Surat } = require("../models/index");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

const lihatProfil = async (req, res) => {
  try {
  
    console.log(req.userId);
    // res.json(req.user)
    const lihatProfil = await User.findByPk(req.userId);
    console.log (lihatProfil)
    const userId = lihatProfil.id;
    const userRole = lihatProfil.role;
    const userEmail = lihatProfil.email;
    const userNamaDepan = lihatProfil.nama_depan;
    const userNamaBelakang = lihatProfil.nama_belakang;
    const userProfil = lihatProfil.foto_profil;
    const userNo_Identitas = lihatProfil.no_identitas;
    const userNo_Hp = lihatProfil.no_hp;
    const userAlamat = lihatProfil.alamat;
    const title = 'Profile';
    res.render('kaprodi/profile', {userId, userRole, userEmail, userNamaDepan, userNamaBelakang, userProfil, userNo_Identitas, userNo_Hp, userAlamat, title});
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const updateProfilMhs = async (req, res) => {
    try {
      const { email, nama_depan, nama_belakang, no_identitas, no_hp, alamat } = req.body;
      
      console.log(req.userId);
      // res.json(req.user)
      await User.update(
        { email: email,
          nama_depan: nama_depan,
          nama_belakang: nama_belakang,
          no_identitas: no_identitas,
          no_hp: no_hp,
          alamat: alamat
        },
        {
          where: {
        id: req.userId,
      },
    },
  );
  res.redirect('/kaprodi/profile')  
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
  

}
const aksesUpdateProfil = async (req, res) => {
  try {
    
    const lihatProfil = await User.findByPk(req.userId);
    console.log (lihatProfil)
    const userId = lihatProfil.id;
    const userRole = lihatProfil.role;
    const userEmail = lihatProfil.email;
    const userNamaDepan = lihatProfil.nama_depan;
    const userNamaBelakang = lihatProfil.nama_belakang;
    const userNo_Identitas = lihatProfil.no_identitas;
    const userNo_Hp = lihatProfil.no_hp;
    const userAlamat = lihatProfil.alamat;
    const title = 'Edit Profile'

    res.render('kaprodi/editprofil', {userId, userRole, userEmail, userNamaDepan,userNamaBelakang, userNo_Identitas, userNo_Hp, userAlamat, title}); 
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }

}
const lihatPersetujuan = async (req, res) => {
  try {
    const lihatPersetujuan = await Formulir.findAll({
      where: {
        acceptByAdmin: 1
      },
      include:[{model:User}]
    });
    console.log(lihatPersetujuan)
    //return res.json(lihatPersetujuan)
    const nomorSurat = lihatPersetujuan.nomorSurat;
    const tanggalDikirim = lihatPersetujuan.tanggalDikirim;
    const tanggalDisetujui = lihatPersetujuan.tanggalDisetujui;
    const penerima = lihatPersetujuan.penerima;
    const instansi = lihatPersetujuan.instansi;
    const acceptByAdmin = lihatPersetujuan.acceptByAdmin;
    const acceptByKaprodi = lihatPersetujuan.acceptByKaprodi;
    const judulTA = lihatPersetujuan.judulTA;
    const title = 'Persetujuan';
  
    res.render('kaprodi/persetujuan', {lihatPersetujuan, nomorSurat,tanggalDikirim,tanggalDisetujui,penerima,instansi,acceptByAdmin,acceptByKaprodi,judulTA,title});
  }
  catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }

}
const terimaFormulir = async (req,res)=> {
  try {
    const nomorSurat = req.params.nomorSurat;
    const statusFormulir = await Formulir.findOne({where:{nomorSurat}});
    statusFormulir.update({acceptByKaprodi : 1});
    res.redirect ('/kaprodi/persetujuan')
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }

}
const tolakFormulir = async (req, res) => {
  try {
    const { nomorSurat } = req.params;
    const statusFormulir = await Formulir.findOne({ where: { nomorSurat } });
    
    if (!statusFormulir) {
      return res.status(404).json({ message: "Formulir not found" });
    }

    await statusFormulir.update({ acceptByAdmin: 2, acceptByKaprodi: 2 });

    res.redirect('/kaprodi/persetujuan');
  } catch (error) {
    console.error("Error during rejection: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/auth/login");
 
}

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

    res.render("kaprodi/detail", { requestDetail: lihatDetail, title });
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }

  
};
const formulirDiterima = async (req,res) => {
  try {
    
    const formulirDiterima = await Formulir.findAll({
      include: [{ model: User }],
      where: {
        acceptByKaprodi: 1,
      },     
    })
    const title = "Formulir yang Diterima";
    // console.log(formulirDiterima);
    res.render("kaprodi/diterima", {formulirDiterima, title})

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
        acceptByKaprodi: 2,
      },     
    })
    const title = "Formulir yang Ditolak";
    // console.log(formulirDitolak);
    res.render("kaprodi/ditolak", {formulirDitolak, title})

  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Middleware untuk menyimpan file
// Middleware untuk menyimpan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// File filter untuk hanya mengizinkan PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diizinkan'), false);
  }
};

// Konfigurasi multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single('surat');

// Endpoint untuk menampilkan halaman upload
const uploadFile = (req, res) => {
  const title = 'Upload File';
  const { nomorSurat } = req.params;
  res.render('kaprodi/upload', { nomorSurat, title });
};

// Endpoint untuk mengunggah file
const kirimFile = async (req, res) => {
  console.log("agyysxgysxgysyxggguxgusuixusuxsux");
  const nomorSurat = req.params.nomorSurat;
  console.log(nomorSurat);
  upload(req, res, async (err) => {
    if (err) {
      res.cookie('error', err.message, {
        maxAge: 1000,
        httpOnly: true,
      });
      return res.status(400).redirect(`/kaprodi/detail/${nomorSurat}`);
    }

    if (!req.file) {
      res.cookie('error', 'Tidak ada file yang diunggah.', {
        maxAge: 1000,
        httpOnly: true,
      });
      return res.status(400).redirect(`/kaprodi/detail/${nomorSurat}`);
    }

    try {
      const document = await Surat.create({
        nomorSurat: nomorSurat,
        nama_file: req.file.filename,
      });
      if(!document){
        console.log("error");
      }
      res.cookie('success', 'File Berhasil Di Upload', {
        maxAge: 1000,
        httpOnly: true,
      });
      return res.redirect('/kaprodi/persetujuan');
    } catch (dbError) {
      res.cookie('error', 'Terjadi kesalahan saat menyimpan data ke database.', {
        maxAge: 1000,
        httpOnly: true,
      });
      return res.status(500).redirect(`/kaprodi/upload/${nomorSurat}`);
    }
  });
};

module.exports = {
  
  logout,
  updateProfilMhs,
  lihatProfil,
  aksesUpdateProfil,
  lihatPersetujuan,
  terimaFormulir,
  tolakFormulir,
  lihatDetail,
  formulirDiterima,
  formulirDitolak,
  uploadFile,
  kirimFile
};