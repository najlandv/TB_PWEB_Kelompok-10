var express = require('express');
var router = express.Router();
const controller = require('../controllers/AuthController');
const verifyToken= require ('../middleware/validtokenMiddleware');
const isLogin = require('../middleware/isloginMiddleware');
const passcontroller = require('../controllers/UbahpassController')



router.get('/', isLogin, controller.form);
router.post('/checklogin', controller.checklogin);
router.post('/logout', verifyToken,controller.logout);
router.post('/changepass', verifyToken, passcontroller.ubahpass);
router.get('/ubahPassword', verifyToken, passcontroller.formchangepass)
module.exports = router;