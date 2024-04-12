const form = $('.form-input');
const messageInput = $('.inputMessage');
const parentElement = $('.listUser');
const userClientId = userLoggedInId;
let userReceived;

function displayMessageInChat(message, senderID) {
  const userMessage = $('<span>').addClass('spanMessage').text(message);

  const messageContainer = $('<div>')
    .append(userMessage)
    .addClass('messageContainer');

  // Set data attribute for the sender ID
  messageContainer.attr('data-user-message', senderID);

  console.log(userClientId);
  console.log(senderID);

  // Add appropriate class based on the sender
  if (userClientId !== senderID) {
    messageContainer.addClass('owner-false');
  }

  $('.messageList').append(messageContainer);
}

function createRoomID(userID1, userID2) {
  const sortedIDs = [userID1, userID2].sort();
  return sortedIDs.join('_');
}

form.on('submit', async (e) => {
  e.preventDefault();
  const message = messageInput.val();
  const selectedUser = $('.listUser .users.selected');
  if (!message || !selectedUser.length) return;

  const userID = selectedUser.data('user-room');
  const room = createRoomID(userClientId, userID);

  displayMessageInChat(message, userClientId);

  const userMessageData = { message, room, userReceived };
  socket.emit('send-message', userMessageData);
  messageInput.val('');
});

socket.on('getUsersMessage', async (messages) => {
  $('.messageList').empty();

  // Map each message to a promise that displays the message
  const displayPromises = messages.map((message) =>
    displayMessageInChat(message.message, message.user)
  );

  // Wait for all display promises to complete
  await Promise.all(displayPromises);
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
