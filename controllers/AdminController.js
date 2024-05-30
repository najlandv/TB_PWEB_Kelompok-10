const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const { Formulir } = require("../models/index");
const { where } = require("sequelize");

const form = (req, res) => {
  
  res.render("login", { title: "Express" });
};

const checklogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Menggunakan nama variabel lain untuk menyimpan hasil pencarian user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: 86400 }
    );

    // Set cookie dengan token
    res.cookie("token", token, { httpOnly: true });

    // Redirect ke halaman sesuai dengan peran pengguna
    if (user.role == "mahasiswa"){
      return res.redirect("/home");
    } else if (user.role == "kaprodi"){
      return res.redirect("/kaprodi/dashboard");
    } else if(user.role == "admin"){
      return res.redirect("/admin/dashboard");
    }

    // Jika tidak ada peran yang cocok, berikan respons standar
    res.status(200).send({ auth: true, token: token });

  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    res.render('admin/profile', {userId, userRole, userEmail, userNamaDepan, userNamaBelakang, userProfil, userNo_Identitas, userNo_Hp, userAlamat, title});
    
  } catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const updateProfilMhs = async (req, res) => {
  try {
    const { email, nama, no_identitas, no_hp, alamat } = req.body;
    
    console.log(req.userId);
    // res.json(req.user)
    await User.update(
      { email: email,
        nama: nama,
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
res.redirect('/admin/profil')  
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
    const userNama = lihatProfil.nama;
    const userNo_Identitas = lihatProfil.no_identitas;
    const userNo_Hp = lihatProfil.no_hp;
    const userAlamat = lihatProfil.alamat;

    res.render('profil/editprofil', {userId, userRole, userEmail, userNama, userNo_Identitas, userNo_Hp, userAlamat}); 
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
    // return res.json(lihatPersetujuan)
    const nomorSurat = lihatPersetujuan.nomorSurat;
    const tanggalDikirim = lihatPersetujuan.tanggalDikirim;
    const tanggalDisetujui = lihatPersetujuan.tanggalDisetujui;
    const penerima = lihatPersetujuan.penerima;
    const instansi = lihatPersetujuan.instansi;
    const acceptByAdmin = lihatPersetujuan.acceptByAdmin;
    const acceptByKaprodi = lihatPersetujuan.acceptByKaprodi;
    const judulTA = lihatPersetujuan.judulTA;
    const title = 'Persetujuan';
  
    res.render('admin/persetujuan', {lihatPersetujuan, nomorSurat,tanggalDikirim,tanggalDisetujui,penerima,instansi,acceptByAdmin,acceptByKaprodi,judulTA,title});
  }
  catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }

}

const lihatAkun = async (req,res) => {
  try {
    const lihatAkun  = await User.findAll({});
    console.log(lihatAkun)
    // return res.json(lihatAkun);

    const title = 'Akun';

    res.render('admin/akun', {lihatAkun, title})

  }
  catch (error) {
    console.error("Error during login: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
 
const lihatDetail =  async (req,res) => {
  try {
    const lihatDetail = await Formulir.findOne({
      include:[{model:User}]
    });
    console.log(lihatDetail)
    // return res.json(lihatDetail)

    const title = 'Detail Formulir';
  
    res.render('admin/detail', {lihatDetail,title});
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
    statusFormulir.update({acceptByAdmin : 1});
    res.redirect ('/admin/persetujuan')
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
    res.redirect ('/admin/persetujuan')
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
  form,
  checklogin,
  logout,
  updateProfilMhs,
  lihatProfil,
  aksesUpdateProfil,
  lihatPersetujuan,
  lihatAkun,
  lihatDetail,
  terimaFormulir,
  tolakFormulir
};