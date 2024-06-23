const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();

const mhsRouter = require('./routes/mahasiswaRoute');
const adminRouter = require('./routes/adminRoute');
const kaprodiRouter = require('./routes/kaprodiRoute');
const authRouter = require('./routes/authRoute');
const methodOverride = require('method-override');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(methodOverride('_method'));


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/mahasiswa', mhsRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/kaprodi', kaprodiRouter);

app.get('/', (req, res) => {
  res.render('login');
});

io.on('connection', (socket) => {
  socket.on('joinRoom', (role) => {
      if (role === 'admin') {
        console.log('Admin connected');
        socket.join('admin');
      }
  });
  socket.on("join",(userId)=>{
    console.log(`User with id ${userId} joined room`);
    socket.join(userId)
  })
  socket.on("permintaan_formulir", (data) => {
    console.log(data);
    const { userId } = data
    socket.to(userId).emit("permintaan_formulir", {
      message: `Pengajuan Formulir Diterima!`,
    });
  })

  socket.on("permintaan_ditolak", (data) => {
    console.log(data);
    const { userId } = data;
    socket.to(userId).emit("permintaan_ditolak", {
      message: `Pengajuan Formulir Ditolak!`,
    });
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.set('io', io);


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
