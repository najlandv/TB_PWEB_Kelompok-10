const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/validtokenMiddleware");
const AdminControllerr = require("../controllers/AdminController");
const role = require("../middleware/checkroleMiddleware");

router.get("/notfound", verifyToken, function (req, res, next) {
  res.render("notfound");
});

router.get("/dashboard", verifyToken, role("admin"), function (req, res, next) {
  const title = "Dashboard";
  res.render("admin/dashboard", { title });
});

router.get(
  "/profile",
  verifyToken,
  role("admin"),
  AdminControllerr.lihatProfil
);
router.get(
  "/persetujuan",
  verifyToken,
  role("admin"),
  AdminControllerr.lihatPersetujuan
);
router.get("/akun", verifyToken, role("admin"), AdminControllerr.lihatAkun);
router.get(
  "/detail/:nomorSurat",
  verifyToken,
  role("admin"),
  AdminControllerr.lihatDetail
);
router.post(
  "/persetujuan/:nomorSurat/terima",
  verifyToken,
  role("admin"),
  AdminControllerr.terimaFormulir
);
router.post(
  "/persetujuan/:nomorSurat/tolak",
  verifyToken,
  role("admin"),
  AdminControllerr.tolakFormulir
);
router.get("/admintemplate", verifyToken, role("admin"), (req, res) => {
  res.render("admin/admin");
});
// router.route("/riwayat").get(AdminControllerr.riwayatSurat);
router.get("/riwayat",verifyToken,role("admin"),AdminControllerr.riwayatSurat);
router.get("/diterima",verifyToken,role("admin"),AdminControllerr.formulirDiterima);
router.get("/ditolak",verifyToken,role("admin"),AdminControllerr.formulirDitolak);
router.post("/deletesurat/:nomorSurat/delete", verifyToken,role("admin"),AdminControllerr.hapusSurat);
router.get("/riwayat/:angkatan",verifyToken,role("admin"),AdminControllerr.riwayatSuratByTahun);


module.exports = router;
