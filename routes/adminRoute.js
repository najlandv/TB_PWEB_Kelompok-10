var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');
const AdminControllerr= require('../controllers/AdminController');
const role = require ('../middleware/checkroleMiddleware');


router.get('/notfound', verifyToken, function(req, res, next) {
  res.render('notfound');
});


router.get('/dashboard', verifyToken, role('admin'), function(req, res, next) {
  const title = 'Dashboard';
  res.render('admin/dashboard', {title}); 
});

router.get('/profile', verifyToken,role('admin'), AdminControllerr.lihatProfil);
router.get('/persetujuan', verifyToken,role('admin'), AdminControllerr.lihatPersetujuan);
router.get('/akun', verifyToken, role('admin'), AdminControllerr.lihatAkun);
router.get('/detail', verifyToken, role('admin'), AdminControllerr.lihatDetail);
router.post('/persetujuan/:nomorSurat',verifyToken,role('admin'), AdminControllerr.terimaFormulir)
router.post('/persetujuan/:nomorSurat',verifyToken,role('admin'), AdminControllerr.tolakFormulir)


module.exports = router;