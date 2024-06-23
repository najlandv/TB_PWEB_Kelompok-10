const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const form = (req, res) => {
  console.log("Rendering Form Login");
  res.render("login", { title: "Express", error: null });
};

const checklogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log("User Not Found!");
      return res.status(404).render("login",{ title:"Express", error: "Email atau Passward salah! Silahkan coba lagi" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).render("login", { title: "Express",layout:false, error: "Email atau Passward salah! Silahkan coba lagi" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, nama_depan: user.nama_depan, no_identitas: user.no_identitas, alamat: user.alamat, no_hp: user.no_hp},
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: 86400 }
    );


    res.cookie("token", token, { httpOnly: true });

    const io = req.app.get('io');
    const userId = user.id.toString();

    io.on('connection', (socket) => {
      socket.emit('join', userId);
    });


    if (user.role === "mahasiswa") {
      return res.redirect("/mahasiswa/dashboard");
    } else if (user.role === "kaprodi") {
      return res.redirect("/kaprodi/dashboard");
    } else if (user.role === "admin") {
      return res.redirect("/admin/dashboard");
    }


    res.status(200).send({ auth: true, token: token });

  } catch (err) {
    console.error("Error during login: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

function logout(req, res) {
  res.clearCookie("token");
  res.redirect("/");
}

module.exports = {
  form,
  checklogin,
  logout,
};