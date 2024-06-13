const socket = io('http://localhost:3000');

let activeUsers = [];

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('joinRoom', 'mahasiswa');
});

socket.on('new_formulir', (data) => {
  console.log('Notifikasi baru:', data);
  showNotification(data);
});
// admin
function showNotification(data) {
  const notificationContainer = document.getElementById('notification-container');
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <strong>${data.message}</strong>
    <p>${data.formulir.nim} mengirimkan formulir</p>
  `;
  notificationContainer.appendChild(notification);

  setTimeout(() => {
    notificationContainer.removeChild(notification);
  }, 5000);
}

// mahasiswa
function tampilNotifikasi(data) {
  const notifikasiContainer = document.getElementById('notification-container');
  const notifikasi = document.createElement('div');
  notifikasi.className = 'notification';
  notifikasi.innerHTML = `
    <strong>${data.message}</strong>
    <p>Admin menerima formulir</p>
  `;
  notifikasiContainer.appendChild(notification);

  setTimeout(() => {
    notifikasiContainer.removeChild(notification);
  }, 5000);
}