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
router.get('/akun', verifyToken, role('admin'), function(req, res) {
  const title = 'akun';
  res.render('admin/akun',{title});
});


module.exports = router;