var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');
const KaprodiControllerr= require('../controllers/KaprodiController');
const role = require ('../middleware/checkroleMiddleware');


router.get('/notfound', verifyToken, function(req, res, next) {
  res.render('notfound');
});


router.get('/dashboard', verifyToken, role('kaprodi'), function(req, res, next) {
  const title = 'Dashboard';
  res.render('kaprodi/dashboard', {title}); 
});

// router.get('/admin/profile', verifyToken, function (req, res, next) {
//   const userId = req.userId;
//   const userRole = req.userRole;
//   const userEmail = req.userEmail;
//   const userNama = req.userNama;
//   const userNo_Identitas = req.userNo_Identitas;
//   const userNo_Hp = req.userNo_Hp;
//   const userAlamat = req.userAlamat;

//   res.render('admin/profile', {userId, userRole, userEmail, userNama, userNo_Identitas, userNo_Hp, userAlamat})
// })

router.get('/profile', verifyToken,role('kaprodi'), KaprodiControllerr.lihatProfil);
router.get('/editprofil', verifyToken,role('kaprodi'), KaprodiControllerr.aksesUpdateProfil)
router.patch('/editprofil', verifyToken,role('kaprodi'), KaprodiControllerr.updateProfilMhs)
module.exports = router;

