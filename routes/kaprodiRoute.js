var express = require('express');
var router = express.Router();
const verifyToken= require ('../middleware/validtokenMiddleware');
const role= require ('../middleware/checkroleMiddleware');

// router.use(role('kaprodi'));

router.get('/dashboard', verifyToken, role('kaprodi') , function(req, res, next) {
  res.render('dosen/dashboard');
});

module.exports = router;