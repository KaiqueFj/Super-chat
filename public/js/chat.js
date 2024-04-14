const form = $('.form-input');
const messageInput = $('.inputMessage');
const parentElement = $('.listUser');
const chatContainer = $('.messageList');
const searchButtonChat = $('.searchTextInChatBtn');
const searchInputChat = $('.searchInput');
const userClientId = userLoggedInId;
let userReceived;
let roomName;

$(document).ready(function (e) {
  searchButtonChat.on('click', function (e) {
    e.preventDefault();

    searchInputChat.toggleClass('hidden');
  });
});

function scrollToBottom() {
  chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
}

function createMessageContainer(message, senderID, createdAt) {
  const userMessage = $('<span>').addClass('spanMessage').text(message);
  const createdAtDate = new Date(createdAt);
  const formattedTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formattedTimeResult = formattedTime(createdAtDate);

  const userMessageCreatedAt = $('<span>')
    .addClass('spanCreatedAt')
    .text(formattedTimeResult);

  const messageContainer = $('<div>')
    .append(userMessage)
    .append(userMessageCreatedAt)
    .addClass('messageContainer');

  messageContainer.attr('data-user-message', senderID);

  if (userClientId !== senderID) {
    messageContainer.addClass('owner-false');
  }

  return messageContainer;
}

// Function to display a message in the chat
function displayMessageInChat(message, senderID, createdAt) {
  const messageContainer = createMessageContainer(message, senderID, createdAt);
  $('.messageList').append(messageContainer);
  scrollToBottom();
}

// Function to get the room ID
function createRoomID(userID1, userID2) {
  const sortedIDs = [userID1, userID2].sort();
  return sortedIDs.join('_');
}

// Function to handle form submission
function handleFormSubmission() {
  form.on('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.val();
    const selectedUser = $('.listUser .users.selected');
    if (!message || !selectedUser.length) return;

    const userID = selectedUser.data('user-room');
    const room = createRoomID(userClientId, userID);

    const userMessageData = { message, room, userReceived };
    socket.emit('send-message', userMessageData);

    messageInput.val('');
  });
}

// Function to handle click event on user
function handleUserClick() {
  parentElement.on('click', '.users', (e) => {
    const target = $(e.target).closest('.users');
    const userName = target.find('.userName').text();
    const userID = target.data('user-room');
    const room = createRoomID(userClientId, userID);
    userReceived = userName;
    roomName = room;

    $('.userNameSelected').text(userName);
    $('.users').removeClass('selected');
    target.addClass('selected');
    socket.emit('getUserMessageFromDatabase', roomName);

    socket.emit('join-room', roomName, (message) => {
      displayMessageInChat(message);
    });
  });
}

// Listen for incoming messages from the server
socket.on('received-message', (message) => {
  console.log(message);
  displayMessageInChat(message.message, message.user, message.createdAt);
});

// Listen for messages from the server and display them
socket.on('getUsersMessage', async (messages) => {
  $('.messageList').empty();
  const displayPromises = messages.map((message) =>
    displayMessageInChat(message.message, message.user, message.createdAt)
  );
  await Promise.all(displayPromises);
});

// Initialize form submission handler
handleFormSubmission();

// Initialize user click handler
handleUserClick();
