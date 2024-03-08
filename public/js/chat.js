const form = document.querySelector('.form-input');
const messageInput = document.querySelector('.inputMessage');
const roomInput = document.querySelector('.inputRoom');
const messages = document.querySelector('messageList');
const btnJoin = document.querySelector('.join');

//function used to display the messages in the form
function displayMessage(message) {
  $('.messageList').append($('<li>').text(message));
}

//capture the message
socket.on('received-message', (message) => {
  displayMessage(`${message.message}`);
});

//forms used to put the message and room to be sent by the user
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;
  if (message === '') return;

  displayMessage(message);
  const messageTest = { message, room };
  socket.emit('send-message', messageTest);
  messageInput.value = '';
});

// When the 'users' event is received from the server
socket.on('users', (users) => {
  users.map((user) => {
    displayMessage(user.message);
  });
});

socket.emit('getUsers');

//btn used to enter in room
btnJoin.addEventListener('click', () => {
  const room = roomInput.value;
  socket.emit('join-room', room, (message) => {
    displayMessage(message);
  });
});
