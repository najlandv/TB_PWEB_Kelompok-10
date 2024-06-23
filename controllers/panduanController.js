const { User } = require("../models/index");
const panduan = (req, res) => {
  const user_id = req.userId;
  res.render("mahasiswa/panduan", { user_id, title: "Express" });
  };

  module.exports={
    panduan
  }