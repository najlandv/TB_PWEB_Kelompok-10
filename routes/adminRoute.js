var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');

const role = require ('../middleware/checkroleMiddleware');

// router.use(role('admin'));

router.get('/dashboard', verifyToken, role('admin'), function(req, res, next) {
  res.render('admin/dashboard'); 
});

router.get('/profil', verifyToken, function (req, res, next) {
  const userId = req.userId;
  const userRole = req.userRole;
  const userEmail = req.userEmail;
  const userNama = req.userNama;
  const userNo_Identitas = req.userNo_Identitas;
  const userNo_Hp = req.userNo_Hp;
  const userAlamat = req.userAlamat;

  res.render('profil/profil', {userId, userRole, userEmail, userNama, userNo_Identitas, userNo_Hp, userAlamat});
})


module.exports = router;