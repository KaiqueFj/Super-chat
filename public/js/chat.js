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
let userReceived;
let roomName;
let allUsers = [];

// Helper functions
function formattedTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function scrollToBottom() {
  chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
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
  const userMessage = $('<span>')
    .addClass('spanMessage')
    .text(message)
    .attr('data-message', messageID);
  const createdAtDate = new Date(createdAt);
  const formattedTimeResult = formattedTime(createdAtDate);
  const userMessageCreatedAt = $('<span>')
    .addClass('spanCreatedAt')
    .text(formattedTimeResult);
  const messageContainer = $('<div>')
    .append(userMessage)
    .append(userMessageCreatedAt)
    .addClass('messageContainer')
    .attr('data-user-message', senderID);

  messageContainer.on('contextmenu', function (event) {
    event.preventDefault();
    event.stopPropagation();

    const contextMenu = $(this).find('.contextMenu');
    if (contextMenu.length) {
      contextMenu.remove();
    } else {
      const containerPos = $(this).offset();
      const containerHeight = $(this).outerHeight();
      const posX = event.clientX;
      const posY = containerPos.top + containerHeight - 50;

      const newContextMenu = $('<div>').addClass('contextMenu');
      newContextMenu.css({ top: posY + 'px', left: posX + 'px' });

      const copyIcon = $('<i>').addClass('fa-solid fa-copy');
      const editIcon = $('<i>').addClass('fa-solid fa-pencil');
      const deleteIcon = $('<i>').addClass('fa-solid fa-trash-can');
      const checkIcon = $('<i>').addClass('fa-solid fa-check');

      const copyButton = $('<div>')
        .text('Copy text')
        .addClass('menuItemContextMenu')
        .prepend(copyIcon);
      const editButton = $('<div>')
        .text('Edit')
        .addClass('menuItemContextMenu')
        .prepend(editIcon);
      const deleteButton = $('<div>')
        .text('Delete')
        .addClass('menuItemContextMenu')
        .prepend(deleteIcon);

      newContextMenu.append(copyButton).append(editButton).append(deleteButton);
      $(this).append(newContextMenu);

      setTimeout(() => {
        newContextMenu.addClass('show');
      }, 10);

      deleteButton.on('click', function (e) {
        e.preventDefault();
        const messageID = userMessage.attr('data-message');
        if (senderID === userClientId) {
          socket.emit('delete-message', messageID);
          messageContainer.remove();
        }
        newContextMenu.remove();
      });

      editButton.on('click', function (e) {
        e.preventDefault();
        const currentMessage = $(this)
          .closest('.messageContainer')
          .find('.spanMessage')
          .text();
        const messageContainer = $(this).closest('.messageContainer');
        const editInput = $('<input>')
          .attr('type', 'text')
          .val(currentMessage)
          .addClass('edit-messageInput');
        const editButton = $('<button>')
          .prepend(checkIcon)
          .addClass('edit-messageBtn');
        const editForm = $('<form>')
          .append(editInput, editButton)
          .addClass('edit-messageForm');

        messageContainer.find('.spanMessage').hide();
        messageContainer.append(editForm);

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

        newContextMenu.remove();
      });

      copyButton.on('click', (e) => {
        e.preventDefault();
        const currentMessage = $(this)
          .closest('.messageContainer')
          .find('.spanMessage')
          .text();
        navigator.clipboard.writeText(currentMessage);
        newContextMenu.remove();
      });
    }
  });

  messageContainer.attr('data-user-message', senderID);
  userMessage.attr('data-message', messageID);

  if (userClientId !== senderID) {
    messageContainer.addClass('owner-false');
  }

  return messageContainer;
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

    const userMessageData = { message, room, userReceived };
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

    const room = createRoomID(userClientId, userID);
    userReceived = userName;
    roomName = room;

    target.find('.roundNotification').toggleClass('hidden');
    receivedMessageCount = 0;

    $('.userNameSelected').text(userName);
    $('.user-img.selected').attr('src', userPhoto);

    $('.users').removeClass('selected');
    target.addClass('selected');
    socket.emit('getUserMessageFromDatabase', roomName);
    socket.emit('join-room', roomName, () => {});
  });
}

function handleUserSearch() {
  chatParentElement.on('click', '.searchTextInChatBtn', (e) => {
    e.preventDefault();
    searchInputChat.toggleClass('hidden');
    const searchQuery = searchInputChat.val().trim();
    socket.emit('getUserMessageSearched', roomName, searchQuery);
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

// Socket event listeners
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

socket.on('received-message', (message) => {
  $('.users').each(function () {
    const roomID = userClientId + '_' + $(this).data('user-room');
    if (roomID === message.room) {
      const messageContainer = $(this);
      const formatTime = new Date(message.createdAt);
      const CreatedAt = formattedTime(formatTime);

      // Increment the count of received messages
      receivedMessageCount++;
      $('.roundNotification').removeClass('hidden');

      // Create or update the round notification with the new count
      createRoundNotification(messageContainer, receivedMessageCount);
      messageContainer.find('.userMessage').text(message.message);
      messageContainer.find('.messageTime').text(CreatedAt);
    }
  });

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
