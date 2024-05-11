var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');

const role = require ('../middleware/checkroleMiddleware');

// router.use(role('admin'));

router.get('/dashboard', verifyToken, role('admin'), function(req, res, next) {
  res.render('admin/dashboard'); 
});




module.exports = router;