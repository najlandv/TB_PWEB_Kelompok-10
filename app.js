const express = require('express');
const path = require('path');

const app = express();
app.use(express.static('src'));


// Mengatur rute untuk halaman utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '.', 'index.html'));
});

// Menjalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
