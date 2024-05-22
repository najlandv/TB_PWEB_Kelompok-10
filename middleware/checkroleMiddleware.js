function checkRole(role) {
  
    return function(req, res, next) {
      // console.log(req.userRole)
      // console.log(role)
      let test = req.userRole
      if (req.userRole === role) {
        next(); // Lanjut ke rute berikutnya jika peran sesuai
      } else {
        res.json({test, role});
      }
    };
  }

  module.exports = checkRole;