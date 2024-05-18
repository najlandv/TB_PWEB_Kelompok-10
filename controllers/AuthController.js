const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/index");

const form = (req, res) => {
  console.log("Rendering Form Login");
  res.render("login", { title: "Express", error: null });
};

const checklogin = async (req, res) => {
  console.log("Attempting to log in:", req.body);
  const { email, password } = req.body;
  try {
    // Menggunakan nama variabel lain untuk menyimpan hasil pencarian user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("User Not Found!");
      return res.status(404).render("login",{ title:"Express", error: "Email atau Passward salah! Silahkan coba lagi" });
    }

    // Verifikasi password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).render("login", { title: "Express", error: "Email atau Passward salah! Silahkan coba lagi" });
    }

    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nama: user.nama, no_identitas: user.no_identitas, alamat: user.alamat, no_hp: user.no_hp},
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: 86400 }
    );

    // Set cookie dengan token
    res.cookie("token", token, { httpOnly: true });

    // Redirect ke halaman sesuai dengan peran pengguna
    if (user.role == "mahasiswa"){
      return res.redirect("/mahasiswa/home");
    } else if (user.role == "kaprodi"){
      return res.redirect("/dosen/dashboard");
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

function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/auth/login");
 
}



module.exports = {
  form,
  checklogin,
  logout,
};