// DOM elements
const form = $('.form-input');
const messageInput = $('.inputMessage');
const parentElement = $('.listUser');
const chatContainer = $('.messageList');
const chatParentElement = $('.searchForm');
const searchUserParentElement = $('.searchForUsers');
const searchInputForUsers = $('.searchInputUsers');
const searchInputChat = $('.searchInput');
const userSelectedToChat = $('.userSelectedChat');
const messageFormContainer = $('.messageFormContainer');

//Notification handler
let receivedMessageCount = 0;

// User data
const userClientId = userLoggedInId;
let userThatReceivesMessage;
let roomName;
let allUsers = [];

let clientId = userClientId;

// Helper functions
function formattedTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function scrollToBottom() {
  chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
}

function createMenuItem(text, iconClass) {
  return $('<div>')
    .text(text)
    .addClass('menuItemContextMenu')
    .prepend($('<i>').addClass('fa-solid ' + iconClass));
}

function scrollToMessage(messageID) {
  const messageElement = $(
    `.messageContainer[data-user-message="${messageID}"]`
  );
  if (messageElement.length) {
    const position = messageElement.position().top;
    chatContainer.scrollTop(position);
  }
}

function createMessageContainer(message, messageID, senderID, createdAt) {
  const userMessage = createUserMessage(message, messageID);
  const userMessageCreatedAt = createUserMessageCreatedAt(createdAt);
  const messageReadIcon = $('<i>').addClass('fa-solid fa-check-double');

  const messageContainer = $('<div>')
    .append(userMessage)
    .append(userMessageCreatedAt)
    .append(messageReadIcon)
    .addClass('messageContainer')
    .attr('data-user-message', senderID);

  messageContainer.on('contextmenu', function (event) {
    handleContextMenu(event, this, senderID);
  });

  if (userClientId !== senderID) {
    messageContainer.addClass('owner-false');
  }

  return messageContainer;
}

function createUserMessage(message, messageID) {
  return $('<span>')
    .addClass('spanMessage')
    .text(message)
    .attr('data-message', messageID);
}

function createUserMessageCreatedAt(createdAt) {
  const createdAtDate = new Date(createdAt);
  const formattedTimeResult = formattedTime(createdAtDate);

  return $('<span>').addClass('spanCreatedAt').text(formattedTimeResult);
}

function handleContextMenu(event, messageElement, senderID) {
  event.preventDefault();
  event.stopPropagation();

  const contextMenu = $(messageElement).find('.contextMenu');
  if (contextMenu.length) {
    contextMenu.remove();
  } else {
    const posX = event.clientX;
    const posY =
      $(messageElement).offset().top + $(messageElement).outerHeight() - 50;
    const newContextMenu = createContextMenu(posX, posY);

    $(messageElement).append(newContextMenu);
    newContextMenu.addClass('show');
    attachContextMenuHandlers(newContextMenu, messageElement, senderID);
  }
}

function createContextMenu(posX, posY) {
  const newContextMenu = $('<div>')
    .addClass('contextMenu')
    .css({ top: posY + 'px', left: posX + 'px' });

  const copyButton = createMenuItem('Copy text', 'fa-copy');
  const editButton = createMenuItem('Edit', 'fa-pencil');
  const deleteButton = createMenuItem('Delete', 'fa-trash-can');

  newContextMenu.append(copyButton, editButton, deleteButton);
  return newContextMenu;
}

function createMenuItem(text, iconClass) {
  return $('<div>')
    .text(text)
    .addClass('menuItemContextMenu')
    .prepend($('<i>').addClass('fa-solid ' + iconClass));
}

function attachContextMenuHandlers(contextMenu, messageElement, senderID) {
  const deleteButton = contextMenu.find('.fa-trash-can').parent();
  const editButton = contextMenu.find('.fa-pencil').parent();
  const copyButton = contextMenu.find('.fa-copy').parent();

  deleteButton.on('click', (e) =>
    handleDeleteMessage(e, messageElement, contextMenu, senderID)
  );
  editButton.on('click', (e) =>
    handleEditMessage(e, messageElement, contextMenu)
  );
  copyButton.on('click', (e) =>
    handleCopyMessage(e, messageElement, contextMenu)
  );
}

function handleDeleteMessage(e, messageElement, contextMenu, senderID) {
  e.preventDefault();
  const messageID = $(messageElement).find('.spanMessage').attr('data-message');
  if (senderID === userClientId) {
    socket.emit('delete-message', messageID);
    $(messageElement).remove();
  }
  contextMenu.remove();
}

function handleEditMessage(e, messageElement, contextMenu) {
  e.preventDefault();
  const currentMessage = $(messageElement).find('.spanMessage').text();
  const messageContainer = $(messageElement);
  const editInput = $('<input>')
    .attr('type', 'text')
    .val(currentMessage)
    .addClass('edit-messageInput');
  const editButton = $('<button>')
    .prepend($('<i>').addClass('fa-solid fa-check'))
    .addClass('edit-messageBtn');
  const editForm = $('<form>')
    .append(editInput, editButton)
    .addClass('edit-messageForm');

  messageContainer.find('.spanMessage').hide().after(editForm);

  editButton.on('click', (e) => {
    e.preventDefault();
    const editedMessage = editInput.val().trim();
    if (editedMessage !== '') {
      messageContainer.find('.spanMessage').text(editedMessage).show();
      editForm.remove();
      const messageID = messageContainer
        .find('.spanMessage')
        .attr('data-message');
      socket.emit('edit-message', { messageID, editedMessage });
    }
  });

  contextMenu.remove();
}

function handleCopyMessage(e, messageElement, contextMenu) {
  e.preventDefault();
  const currentMessage = $(messageElement).find('.spanMessage').text();
  navigator.clipboard.writeText(currentMessage);
  contextMenu.remove();
}
// Function to create and update the round notification
function createRoundNotification(container, count) {
  let roundNotification = container.find('.roundNotification');
  if (roundNotification.length === 0) {
    roundNotification = $('<div>').addClass('roundNotification');
    container.append(roundNotification);
  }

  roundNotification.text(count);
}

function displayMessageInChat(message, messageID, senderID, createdAt) {
  const messageContainer = createMessageContainer(
    message,
    messageID,
    senderID,
    createdAt
  );
  $('.messageList').append(messageContainer);
  return messageContainer;
}

function createRoomID(userID1, userID2) {
  const sortedIDs = [userID1, userID2].sort();
  return sortedIDs.join('_');
}

function handleFormSubmission() {
  form.on('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.val();
    const selectedUser = $('.listUser .users.selected');
    if (!message || !selectedUser.length) return;

    const userID = selectedUser.data('user-room');
    const room = createRoomID(userClientId, userID);

    const userMessageData = { message, room, userThatReceivesMessage };
    socket.emit('send-message', userMessageData);

    messageInput.val('');
  });
}

function handleUserClick() {
  parentElement.on('click', '.users', (e) => {
    messageFormContainer.addClass('visible');
    userSelectedToChat.addClass('visible');

    const target = $(e.target).closest('.users');
    const userName = target.find('.userName').text();
    const userID = target.data('user-room');
    const userPhoto = target.find('.user-img').attr('src');
    const userOnline = target.attr('data-online') === 'true';
    const room = createRoomID(userClientId, userID);

    userThatReceivesMessage = userName;
    roomName = room;

    target.find('.roundNotification').toggleClass('hidden');
    receivedMessageCount = 0;

    const statusText = userOnline ? 'online' : 'offline';
    $('.statusBall').removeClass('online offline').addClass(statusText);

    $('.userNameSelected').text(userName);
    $('.user-img.selected').attr('src', userPhoto);

    $('.users').removeClass('selected');
    target.addClass('selected');

    socket.emit('getUserMessageFromDatabase', roomName);
    socket.emit('join-room', roomName, () => {});
  });
}

socket.on('user-status-updated', ({ userID, online }) => {
  const userElement = $(`.users[data-user-room="${userID}"]`);
  const statusTextClass = online ? 'online' : 'offline';
  const statusBallElements = userElement.find('.statusBall, .ball');

  userElement.attr('data-online', online ? 'true' : 'false');

  statusBallElements.removeClass('online offline').addClass(statusTextClass);

  if (userElement.hasClass('selected')) {
    $('.statusBall').removeClass('online offline').addClass(statusTextClass);
  }
});

function handleUserSearch() {
  chatParentElement.on('click', '.searchTextInChatBtn', (e) => {
    e.preventDefault();

    // Toggle visibility of search input
    searchInputChat.toggleClass('hidden');

    // Extract search query and emit socket event
    const searchQuery = searchInputChat.val().trim();
    socket.emit('getUserMessageSearched', roomName, searchQuery);

    // Clear search input after emitting event
    searchInputChat.val('');
  });
}

function handleUserSearchForUsers() {
  searchUserParentElement.on('click', '.searchInputUsers', (e) => {
    e.preventDefault();
    searchUserParentElement.addClass('has-focus');
  });

  searchInputForUsers.on('input', (e) => {
    e.preventDefault();
    const searchQuery = searchInputForUsers.val().trim();
    if (searchQuery.length === 0) {
      renderAllUsers();
    } else {
      socket.emit('getUserSearched', searchQuery);
    }
  });
}

$(document).ready(() => {
  allUsers = [];
  $('.listUser .users').each(function () {
    const user = {
      id: $(this).attr('data-user-room'),
      name: $(this).find('.userName').text(),
      message: $(this).find('.userMessage').text(),
      messageTime: $(this).find('.messageTime').text(),
      photo: $(this).find('.user-img').attr('src').replace('/images/user/', ''),
    };
    allUsers.push(user);
  });
});

function renderAllUsers() {
  $('.listUser').empty();
  allUsers.forEach((user) => {
    createUserElement(user, user.message, user.messageTime);
  });
}

socket.on('getUserSearchedInfo', (searchedUserData, searchedMessageData) => {
  updateSearchResults(searchedUserData, searchedMessageData);
});

// Function to update the user list with search results
function updateSearchResults(searchedUserData, searchedMessageData) {
  $('.listUser').empty();
  for (let i = 0; i < searchedUserData.length; i++) {
    const user = searchedUserData[i];
    const message = searchedMessageData[i]
      ? searchedMessageData[i].message
      : '';
    const createdAt = searchedMessageData[i]
      ? searchedMessageData[i].createdAt
      : '';
    createUserElement(user, message, createdAt);
  }
}

function createUserElement(user, message, createdAt) {
  const createdAtDate = new Date(createdAt);
  const formattedTimeResult = formattedTime(createdAtDate);

  const userElement = $('<div>')
    .addClass('users')
    .attr('data-user-room', user.id)
    .append(
      $('<span>').addClass('userName').text(user.name),
      $('<img>').addClass('user-img').attr('src', `/images/user/${user.photo}`),
      $('<span>').addClass('userMessage').text(message),
      $('<span>').addClass('messageTime').text(formattedTimeResult)
    );

  $('.listUser').append(userElement);
}

socket.on('received-message', (message) => {
  // Check if the message is from a different user
  if (message.user !== userClientId) {
    $('.users').each(function () {
      const roomID = userClientId + '_' + $(this).data('user-room');
      if (roomID === message.room) {
        const messageContainer = $(this);
        const formatTime = new Date(message.createdAt);
        const CreatedAt = formattedTime(formatTime);

        receivedMessageCount++;
        $('.roundNotification').removeClass('hidden');

        createRoundNotification(messageContainer, receivedMessageCount);
        messageContainer.find('.userMessage').text(message.message);
        messageContainer.find('.messageTime').text(CreatedAt);
      }
    });
  }

  displayMessageInChat(
    message.message,
    message._id,
    message.user,
    message.createdAt
  );
  scrollToBottom();
});

socket.on('getUsersMessage', async (messages) => {
  $('.messageList').empty();
  const displayPromises = messages.map((message) => {
    const messageContainer = displayMessageInChat(
      message.message,
      message._id,
      message.user,
      message.createdAt
    );
    // Emit messageRead event if the message is received and belongs to the recipient
    if (message.user === userClientId) {
      socket.emit('messageRead', {
        messageId: message._id,
        readerId: userClientId,
        userReceiver: message.userReceiver,
      });
    }

    return messageContainer;
  });
  await Promise.all(displayPromises);
  scrollToBottom();
});

socket.on('messageReadConfirmation', (data) => {
  const { messageId } = data;
  const messageSpan = $(`.spanMessage[data-message="${messageId}"]`);

  if (messageSpan.length > 0) {
    const messageContainer = messageSpan.closest('.messageContainer');
    const checkIcon = messageContainer.find('.fa-solid.fa-check-double');

    if (checkIcon.length > 0) {
      checkIcon.addClass('double-check');
    }
  }
});

socket.on('getMessagesSearched', async (messages) => {
  $('.messageContainer').removeClass('highlight');

  messages.forEach((message) => {
    $('.messageContainer').each(function () {
      const messageText = $(this).find('.spanMessage').text();
      if (messageText.includes(message.message)) {
        $(this).addClass('highlight');
        scrollToMessage(message.user);
      }
    });
  });
});

// Initialize handlers
handleFormSubmission();
handleUserClick();
handleUserSearch();
handleUserSearchForUsers();
