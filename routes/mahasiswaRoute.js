var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');
const role= require ('../middleware/checkroleMiddleware');
const MhswaController = require('../controllers/MhswaController');
const showNotification = require('../middleware/notifikasimhs');
const panduanController = require('../controllers/panduanController')

router.use(verifyToken);
router.use(showNotification);
router.get('/notfound', verifyToken, function(req, res, next) {
  res.render('notfound');
});
router.get('/dashboard', role('mahasiswa'), MhswaController.dashboard)
router.get('/profil',role('mahasiswa'), MhswaController.lihatProfil)
router.get('/editprofil',role('mahasiswa'), MhswaController.aksesUpdateProfil)
router.patch('/editprofil',role('mahasiswa'), MhswaController.updateProfilMhs)
router.get('/isiformulir',role('mahasiswa'), MhswaController.tampilkanFormulir);
router.post('/kirimformulir',role('mahasiswa'), MhswaController.kirimFormulir);
router.get('/riwayatpermintaan',role('mahasiswa'), MhswaController.riwayatPermintaan);
router.get('/riwayatsurat',role('mahasiswa'), MhswaController.riwayatSurat);
router.get('/detailriwayat/:id',role('mahasiswa'), MhswaController.detailRiwayat);
router.get('/updateformulir/:id',role('mahasiswa'), MhswaController.updateFormulir);
router.post('/editformulir/:id/update',role('mahasiswa'), MhswaController.editFormulir);
router.post('/editformulir/:id/delete',role('mahasiswa'), MhswaController.deleteFormulir); 
router.get('/permintaandisetujui',role('mahasiswa'), MhswaController.riwayatPermintaanDisetujui);
router.get('/permintaanditolak',role('mahasiswa'), MhswaController.riwayatPermintaanDitolak);
router.get('/panduan', verifyToken,role('mahasiswa'), panduanController.panduan)
router.post('/notifikasi/:id/read', role('mahasiswa'), MhswaController.readNotifikasi);
module.exports = router;
