var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');
const role= require ('../middleware/checkroleMiddleware');


router.get('/notfound', verifyToken, function(req, res, next) {
  res.render('notfound');
});

// router.use(role('mahasiswa'));
router.get('/home', verifyToken,role('mahasiswa'), function(req, res, next) {
  res.render('mahasiswa/home');
});

router.get('/profil', verifyToken, function (req, res, next) {
  const userId = req.userId;
  const userRole = req.userRole;
  const userEmail = req.userEmail;
  const userNama = req.userNama;
  const userNo_Identitas = req.userNo_Identitas;
  const userNo_Hp = req.userNo_Hp;
  const userAlamat = req.userAlamat;

  res.render('profil', {userId, userRole, userEmail, userNama, userNo_Identitas, userNo_Hp, userAlamat});
})
module.exports = router;