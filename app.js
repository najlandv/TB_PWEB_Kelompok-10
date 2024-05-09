const express = require('express');
const path = require('path');
const app = express();

app.set('view engine','ejs');
app.set('views',[path.join(__dirname,'/views')]);
app.use(express.static(path.join(__dirname,'/assets')));
app.use(express.static(path.join(__dirname,'/node_modules/preline/dist')));




  app.get('/login', (req, res) => {
    res.render('login')
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Server berjalan di http://localhost:${PORT}');
});