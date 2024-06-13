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

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/mahasiswa', mhsRouter);
app.use('/auth', authRouter);
app.use('/admin', adminRouter);
app.use('/kaprodi', kaprodiRouter);

app.get('/', (req, res) => {
  res.render('login');
});


let activeUsers = [];

io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('joinRoom', (role) => {
      if (role === 'admin') {
        socket.join('admin');
      } else if (role === 'mahasiswa') {
        socket.join('mahasiswa');
        console.log('ini mhs');
      } else if (role === 'kaprodi') {
        socket.join('kaprodi');
      }
  });
    
  socket.on("new-mahasiswa-add", (user_id) => {
    // if user is not added previously
    if (!activeUsers.some((user) => user.userId === user_id)) {
      activeUsers.push({ userId: user_id, socketId: socket.id });
      console.log("New User Connected");
    }
    io.emit('activeUsers', activeUsers);
  });

    socket.on('confirmation_form', (data) => {
      console.log('ini di confirmation_form');
      console.log('ini di confirmation_form', data);
    })
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


app.set('io', io);

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// Server listening
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

module.exports = app;
