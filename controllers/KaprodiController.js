const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const { Formulir } = require("../models/index");

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

const tolakFormulir = async (req,res)=> {
  try {
    const nomorSurat = req.params.nomorSurat;
    const statusFormulir = await Formulir.findOne({where:{nomorSurat}});
    statusFormulir.update({acceptByAdmin : 2,acceptByKaprodi : 2});
    res.redirect ('/kaprodi/persetujuan')
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/auth/login");
 
}



module.exports = {
  
  logout,
  updateProfilMhs,
  lihatProfil,
  aksesUpdateProfil,
  lihatPersetujuan,
  terimaFormulir,
  tolakFormulir
};