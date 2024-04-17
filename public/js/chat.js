const form = $('.form-input');
const messageInput = $('.inputMessage');
const parentElement = $('.listUser');
const chatContainer = $('.messageList');
const chatParentElement = $('.searchForm');
const searchButtonChat = $('.searchTextInChatBtn');
const searchInputChat = $('.searchInput');
const searchForm = $('.searchForm');
const userClientId = userLoggedInId;

let userReceived;
let roomName;

//Function to scroll the chat to the bottom when it loads
function scrollToBottom() {
  chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
}

//Function to scroll the chat to the message that was found after the search
function scrollToMessage(messageID) {
  const messageElement = $(
    `.messageContainer[data-user-message="${messageID}"]`
  );

  if (messageElement.length) {
    const position = messageElement.position().top;

    chatContainer.scrollTop(position);
  }
}

//Function to create the container of the message that is being sent by the user
function createMessageContainer(message, messageID, senderID, createdAt) {
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

  messageContainer.on('contextmenu', function (event) {
    event.preventDefault();
    // Show your custom context menu or perform any other action
    const contextMenu = $('<div>').addClass('contextMenu');

    const posX = event.clientX;
    const posY = event.clientY;

    contextMenu.css({
      top: posY + 'px',
      left: posX + 'px',
    });

    const editButton = $('<button>').text('Edit').addClass('menuItem');
    const deleteButton = $('<button>').text('Delete').addClass('menuItem');

    contextMenu.append(editButton).append(deleteButton);

    messageContainer.append(contextMenu);

    deleteButton.on('click', function (e) {
      e.preventDefault();

      const messageID = userMessage.attr('data-message');
      console.log('Delete button clicked for message:', messageID);

      if (senderID === userClientId) {
        socket.emit('delete-message', messageID);
        messageContainer.remove();
      }
      contextMenu.remove();
    });
  });

  messageContainer.attr('data-user-message', senderID);
  userMessage.attr('data-message', messageID);

  if (userClientId !== senderID) {
    messageContainer.addClass('owner-false');
  }

  return messageContainer;
}

// Function to display a message in the chat
function displayMessageInChat(message, messageID, senderID, createdAt) {
  const messageContainer = createMessageContainer(
    message,
    messageID,
    senderID,
    createdAt
  );
  $('.messageList').append(messageContainer);
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

// Update the event listener for the search button
function handleUserSearch() {
  chatParentElement.on('click', '.searchTextInChatBtn', (e) => {
    e.preventDefault();

    searchInputChat.toggleClass('hidden');

    const searchQuery = searchInputChat.val().trim();

    // Emit the search query to the server
    socket.emit('getUserMessageSearched', roomName, searchQuery);

    searchInputChat.val('');
  });
}

// Listen for incoming messages from the server
socket.on('received-message', (message) => {
  displayMessageInChat(
    message.message,
    message._id,
    message.user,
    message.createdAt
  );
  scrollToBottom();
});

// Listen for messages from the server and display them
socket.on('getUsersMessage', async (messages) => {
  $('.messageList').empty();
  const displayPromises = messages.map((message) =>
    displayMessageInChat(
      message.message,
      message._id,
      message.user,
      message.createdAt
    )
  );
  await Promise.all(displayPromises);
  scrollToBottom();
});

//Listen for the messages that was searched by the user, and display it
socket.on('getMessagesSearched', async (messages) => {
  $('.messageContainer').removeClass('highlight');

  messages.forEach((message) => {
    $('.messageContainer').each(function () {
      const messageText = $(this).find('.spanMessage').text();
      if (messageText.includes(message.message)) {
        $(this).addClass('highlight');
        console.log(message.user);
        scrollToMessage(message.user);
      }
    });
  });
});

// Initialize form submission handler
handleFormSubmission();

// Initialize user click handler
handleUserClick();

// Initialize user search handler
handleUserSearch();
