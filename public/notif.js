const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('joinRoom', 'admin');
});

socket.on('new_formulir', (data) => {
  console.log('Notifikasi baru:', data);
  showNotification(data);
});

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