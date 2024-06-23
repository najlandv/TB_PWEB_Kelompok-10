var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');
const KaprodiControllerr= require('../controllers/KaprodiController');
const role = require ('../middleware/checkroleMiddleware');
const passcontroller = require('../controllers/UbahpassController')
const lihatNotifikasi = require("../middleware/notifikasi");



router.get('/notfound', verifyToken, function(req, res, next) {
  res.render('notfound');
});

router.use(lihatNotifikasi);
router.get('/notifikasi', verifyToken,role("kaprodi"),KaprodiControllerr.lihatNotifikasi);
router.post('/notifikasi/:id/read',verifyToken,role("kaprodi"),KaprodiControllerr.readNotifikasi);

router.get('/dashboard', verifyToken, role('kaprodi'), function(req, res, next) {
  const title = 'Dashboard';
  res.render('kaprodi/dashboard', {title}); 
});



router.get('/profile', verifyToken,role('kaprodi'), KaprodiControllerr.lihatProfil);
router.get('/editprofil', verifyToken,role('kaprodi'), KaprodiControllerr.aksesUpdateProfil)
router.patch('/editprofil', verifyToken,role('kaprodi'), KaprodiControllerr.updateProfilMhs)
router.get('/diterima', verifyToken,role('kaprodi'), KaprodiControllerr.formulirDiterima)
router.get('/ditolak', verifyToken,role('kaprodi'), KaprodiControllerr.formulirDitolak)
router.get('/ubahPassword', verifyToken, passcontroller.formchangepass)
router.get('/persetujuan', verifyToken,role('kaprodi'), KaprodiControllerr.lihatPersetujuan);
router.get('/detail/:nomorSurat', verifyToken,role('kaprodi'), KaprodiControllerr.lihatDetail);
router.post('/persetujuan/:nomorSurat/terima',verifyToken,role('kaprodi'), KaprodiControllerr.terimaFormulir)
router.get('/upload', verifyToken,role('kaprodi'), KaprodiControllerr.uploadFile)
router.post('/upload', verifyToken,role('kaprodi'), KaprodiControllerr.kirimFile)
router.post('/persetujuan/:nomorSurat/tolak',verifyToken,role('kaprodi'), KaprodiControllerr.tolakFormulir)
router.get("/riwayat",verifyToken,role("kaprodi"),KaprodiControllerr.riwayatSurat);

module.exports = router;

