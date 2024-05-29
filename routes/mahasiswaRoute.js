var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');
const role= require ('../middleware/checkroleMiddleware');
const MhswaController = require('../controllers/MhswaController');


router.get('/notfound', verifyToken, function(req, res, next) {
  res.render('notfound');
});

// router.use(role('mahasiswa'));
router.get('/home', verifyToken,role('mahasiswa'), function(req, res, next) {
  res.render('mahasiswa/home');
});

// router.get('/profil', verifyToken, function (req, res, next) {
  // const userId = req.userId;

  // const userRole = req.userRole;
  // const userEmail = req.userEmail;
  // const userNama = req.userNama;
  // const userNo_Identitas = req.userNo_Identitas;
  // const userNo_Hp = req.userNo_Hp;
  // const userAlamat = req.userAlamat;

//   res.render('profil/profil', {userId, userRole, userEmail, userNama, userNo_Identitas, userNo_Hp, userAlamat});
// })
router.get('/profil', verifyToken,role('mahasiswa'), MhswaController.lihatProfil)
router.get('/editprofil', verifyToken,role('mahasiswa'), MhswaController.aksesUpdateProfil)




// router.get('/editprofil', verifyToken, function (req, res, next) {
//   const userId = req.userId;
//   const userRole = req.userRole;
//   const userEmail = req.userEmail;
//   const userNama = req.userNama;
//   const userNo_Identitas = req.userNo_Identitas;
//   const userNo_Hp = req.userNo_Hp;
//   const userAlamat = req.userAlamat;

//   res.render('profil/editprofil', {userId, userRole, userEmail, userNama, userNo_Identitas, userNo_Hp, userAlamat});
// })

// Rute untuk formulir mahasiswa

router.get('/isiformulir', verifyToken,role('mahasiswa'), MhswaController.tampilkanFormulir);
router.post('/kirimformulir', verifyToken,role('mahasiswa'), MhswaController.kirimFormulir);
router.get('/riwayatpermintaan', verifyToken,role('mahasiswa'), MhswaController.riwayatPermintaan);
router.get('/detailriwayat/:id', verifyToken,role('mahasiswa'), MhswaController.detailRiwayat);

module.exports = router;
