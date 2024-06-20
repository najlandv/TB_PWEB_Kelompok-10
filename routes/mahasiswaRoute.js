var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');
const role= require ('../middleware/checkroleMiddleware');
const MhswaController = require('../controllers/MhswaController');


router.get('/notfound', verifyToken, function(req, res, next) {
  res.render('notfound');
});

// router.use(role('mahasiswa'));
// router.get('/home', verifyToken,role('mahasiswa'), function(req, res, next) {
//   res.render('mahasiswa/home');
// });


router.get('/dashboard', verifyToken, role('mahasiswa'), MhswaController.dashboard)
router.get('/profil', verifyToken,role('mahasiswa'), MhswaController.lihatProfil)
router.get('/editprofil', verifyToken,role('mahasiswa'), MhswaController.aksesUpdateProfil)
router.patch('/editprofil', verifyToken,role('mahasiswa'), MhswaController.updateProfilMhs)
router.get('/isiformulir', verifyToken,role('mahasiswa'), MhswaController.tampilkanFormulir);
router.post('/kirimformulir', verifyToken,role('mahasiswa'), MhswaController.kirimFormulir);
router.get('/riwayatpermintaan', verifyToken,role('mahasiswa'), MhswaController.riwayatPermintaan);
router.get('/riwayatsurat', verifyToken,role('mahasiswa'), MhswaController.riwayatSurat);
router.get('/detailriwayat/:id', verifyToken,role('mahasiswa'), MhswaController.detailRiwayat);
router.get('/updateformulir/:id', verifyToken,role('mahasiswa'), MhswaController.updateFormulir);
router.post('/editformulir/:id/update', verifyToken,role('mahasiswa'), MhswaController.editFormulir);
router.post('/editformulir/:id/delete', verifyToken,role('mahasiswa'), MhswaController.deleteFormulir); 
router.get('/permintaandisetujui', verifyToken,role('mahasiswa'), MhswaController.riwayatPermintaanDisetujui);
router.get('/permintaanditolak', verifyToken,role('mahasiswa'), MhswaController.riwayatPermintaanDitolak);


router.get('/test', MhswaController.tesHalaman)
router.post('/test', MhswaController.testpost)
module.exports = router;
