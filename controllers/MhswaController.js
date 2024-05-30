const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");
const {Formulir}  = require("../models/index");
const { where } = require("sequelize");

const form = (req, res) => {
  res.render("login", { title: "Express" });
};

const checklogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: 86400 }
    );

    res.cookie("token", token, { httpOnly: true });

    if (user.role == "mahasiswa") {
      return res.redirect("/home");
    } else if (user.role == "kaprodi") {
      return res.redirect("/kaprodi/dashboard");
    } else if (user.role == "admin") {
      return res.redirect("/admin/dashboard");
    }

    res.status(200).send({ auth: true, token: token });
  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const lihatProfil = async (req, res) => {
  try {
    const lihatProfil = await User.findByPk(req.userId);

    if (!lihatProfil) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      userId: lihatProfil.id,
      userRole: lihatProfil.role,
      userEmail: lihatProfil.email,
      userNamaDepan: lihatProfil.nama_depan,
      userNamaBelakang: lihatProfil.nama_belakang,
      userNo_Identitas: lihatProfil.no_identitas,
      userNo_Hp: lihatProfil.no_hp,
      userAlamat: lihatProfil.alamat,
    };

    res.render('profil/profil', userData);
  } catch (error) {
    console.error("Error during profile view: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateProfilMhs = async (req, res) => {
  try {
    const { email, nama_depan, nama_belakang, no_identitas, no_hp, alamat } = req.body;

    // const user = await User.findOne({ where:{ id:req.userId}});
    // user.update({ email, nama_depan, nama_belakang, no_hp, alamat });
    await User.update(
      {
        email: email,
        nama_depan: nama_depan,
        nama_belakang: nama_belakang,
        no_identitas: no_identitas,
        no_hp: no_hp,
        alamat: alamat,
      },
      {
        where: { id: req.userId },
      }
    );

    res.redirect('/mahasiswa/profil');
  } catch (error) {
    console.error("Error during profile update: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const aksesUpdateProfil = async (req, res) => {
  try {
    const lihatProfil = await User.findByPk(req.userId);

    if (!lihatProfil) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      userId: lihatProfil.id,
      userRole: lihatProfil.role,
      userEmail: lihatProfil.email,
      userNamaDepan: lihatProfil.nama_depan,
      userNamaBelakang: lihatProfil.nama_belakang,
      userNo_Identitas: lihatProfil.no_identitas,
      userNo_Hp: lihatProfil.no_hp,
      userAlamat: lihatProfil.alamat,
    };

    res.render('profil/editprofil', userData);
  } catch (error) {
    console.error("Error during profile access: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const tampilkanFormulir = async (req, res) => {
  try {

    res.render('mahasiswa/isiformulir');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};


const kirimFormulir = async (req, res) => {
  try {
    const { penerima, instansi, judulTA } = req.body;

   // Memasukkan data formulir ke dalam basis data menggunakan model Formulir
    await Formulir.create({ 
      penerima: penerima,
      instansi: instansi,
      judulTA: judulTA,
      id_user:req.userId,
      tanggalDikirim: new Date()
    });

    return res.render('mahasiswa/isiformulir', { successMessage: "Formulir berhasil dikirim!" });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
};

const editFormulir = async (req, res) => {
  try {
    const nomorSurat = req.params.id;
    const updateFormulir = await Formulir.findOne({ where: { nomorSurat }})
    const {penerima,instansi,judulTA} =  req.body
    
    await updateFormulir.update({penerima,instansi,judulTA});

    return res.redirect('/mahasiswa/riwayatpermintaan')
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
};
const deleteFormulir = async (req, res) => {
  try {
    const nomorSurat = req.params.id;
    const updateFormulir = await Formulir.findOne({ where: { nomorSurat }})
   
    await updateFormulir.destroy();

    return res.redirect('/mahasiswa/riwayatpermintaan')
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
};


const updateFormulir = async (req, res) => {
  try {
const nomorSurat = req.params.id;
const updateFormulir = await Formulir.findOne({ where: { nomorSurat }})

res.render('mahasiswa/editformulir', { requestDetail: updateFormulir });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
}


const riwayatPermintaan = async (req, res) => {
  try {
    const riwayatPermintaan = await Formulir.findAll({ where: { id_user: req.userId } });
    console.log(riwayatPermintaan)
    const nomorSurat = riwayatPermintaan.nomorSurat;
    const tanggalDikirim = riwayatPermintaan.tanggalDikirim;
    const penerima = riwayatPermintaan.penerima;
    const instansi = riwayatPermintaan.instansi;
    const judulTA = riwayatPermintaan.judulTA;
    res.render('mahasiswa/riwayatpermintaan', {riwayatPermintaan, nomorSurat, tanggalDikirim, penerima, instansi, judulTA });
    
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
    
  }
}

const detailRiwayat = async (req, res) => {
  try {
const nomorSurat = req.params.id;
const detailRiwayat = await Formulir.findOne({ where: { nomorSurat }})
res.render('mahasiswa/detailriwayat', { requestDetail: detailRiwayat });
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
  }
}
const logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
};

const riwayatPermintaanDisetujui = async (req, res) => {
  try {
    const riwayatPermintaanDisetujui = await Formulir.findAll({ where: { acceptByAdmin:1}})
    res.render('mahasiswa/permintaandisetujui', {riwayatPermintaanDisetujui})
    
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
    
  }
}

const riwayatPermintaanDitolak = async (req, res) => {
  try {
    const riwayatPermintaanDitolak = await Formulir.findAll({ where: { acceptByAdmin:2}})
    res.render('mahasiswa/permintaanditolak', {riwayatPermintaanDitolak})
    
  } catch (error) {
    console.error(error);
    return res.status(500).send('Terjadi Kesalahan Server');
    
  }
}

module.exports = {
  form,
  checklogin,
  logout,
  updateProfilMhs,
  lihatProfil,
  aksesUpdateProfil,
  tampilkanFormulir,
  kirimFormulir,
  riwayatPermintaan,
  detailRiwayat,
  editFormulir,
  deleteFormulir,
  updateFormulir,
  riwayatPermintaanDisetujui,
  riwayatPermintaanDitolak,
};
