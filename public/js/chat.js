const form = $('.form-input');
const messageInput = $('.inputMessage');
const parentElement = $('.listUser');

let userReceived;
const userClientId = userLoggedInId;

function displayMessageInChat(message) {
  $('.messageList').append(
    $('<div>')
      .addClass('messageContainer')
      .append($('<span>').addClass('spanMessage').text(message))
  );
}

function createRoomID(userID1, userID2) {
  const sortedIDs = [userID1, userID2].sort();
  return sortedIDs.join('_');
}

form.on('submit', (e) => {
  e.preventDefault();
  const message = messageInput.val();
  const selectedUser = $('.listUser .users.selected');
  if (!message || !selectedUser.length) return;

  const userID = selectedUser.data('user-room');
  const room = createRoomID(userClientId, userID);

  displayMessageInChat(message);

  const userMessageData = { message, room, userReceived };
  socket.emit('send-message', userMessageData);
  messageInput.val('');
});

socket.on('getUsersMessage', (messages) => {
  $('.messageList').empty();
  messages.forEach((message) => displayMessageInChat(message.message));
});

parentElement.on('click', '.users', (e) => {
  const target = $(e.target).closest('.users');
  const userName = target.find('.userName').text();
  const userID = target.data('user-room');
  const room = createRoomID(userClientId, userID);
  userReceived = userName;

  $('.userNameSelected').text(userName);
  $('.users').removeClass('selected');
  target.addClass('selected');

  socket.emit('getUserMessageFromDatabase', room);
  socket.emit('join-room', room, (message) => {
    displayMessageInChat(message);
  });
});
