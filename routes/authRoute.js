var express = require('express');
var router = express.Router();
const controller = require('../controllers/AuthController');
const verifyToken= require ('../middleware/validtokenMiddleware');
const isLogin = require('../middleware/isloginMiddleware');




router.get('/login', isLogin, controller.form);
router.post('/checklogin', controller.checklogin);
router.post('/logout', verifyToken,controller.logout);
module.exports = router;