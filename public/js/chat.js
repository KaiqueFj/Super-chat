const form = $('.form-input');
const messageInput = $('.inputMessage');
const roomInput = $('.inputRoom');
const parentElement = $('.listUser');
let userData;

// Function used to display messages in the form
function displayMessage(message) {
  $('.messageList').append(
    $('<div>')
      .addClass('messageContainer')
      .append($('<span>').addClass('spanMessage').text(message))
  );
}

// Capture the message and display it live
socket.on('received-message', (message) => {
  displayMessage(message.message);
});

// Forms used to put the message and room to be sent by the user
form.on('submit', (e) => {
  e.preventDefault();
  const message = messageInput.val();
  const room = userData;

  if (!message) return;

  displayMessage(message);

  const userMessageData = { message, room };
  socket.emit('send-message', userMessageData);
  messageInput.val('');
});

// Define event listener for 'getUsersMessage' outside the click event handler
socket.on('getUsersMessage', (messages) => {
  $('.messageList').empty(); // Clear previous messages
  messages.forEach((message) => displayMessage(message.message));
});

// Add click event listener to parentElement
parentElement.on('click', '.users', (e) => {
  $('.users').removeClass('selected');

  const target = $(e.target).closest('.users').addClass('selected');
  const userName = target.find('.userName').text();

  userData = userName;

  const room = userData;
  $('.userNameSelected').text(room);

  if (!target) return;

  // Emit event to server to get messages for the selected user
  socket.emit('getUserMessageFromDatabase', room);

  // Join room
  socket.emit('join-room', room, (message) => {
    displayMessage(message);
  });
});
