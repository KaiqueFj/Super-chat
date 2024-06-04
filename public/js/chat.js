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
      const posX = event.clientX;
      const posY = $(this).offset().top + $(this).outerHeight() - 50;

      const newContextMenu = $('<div>')
        .addClass('contextMenu')
        .css({ top: posY + 'px', left: posX + 'px' });

      const createMenuItem = (text, iconClass) => {
        return $('<div>')
          .text(text)
          .addClass('menuItemContextMenu')
          .prepend($('<i>').addClass('fa-solid ' + iconClass));
      };

      const copyButton = createMenuItem('Copy text', 'fa-copy');
      const editButton = createMenuItem('Edit', 'fa-pencil');
      const deleteButton = createMenuItem('Delete', 'fa-trash-can');

      newContextMenu
        .append(copyButton, editButton, deleteButton)
        .appendTo($(this))
        .addClass('show');

      deleteButton.on('click', function (e) {
        e.preventDefault();
        const messageID = $(this)
          .closest('.messageContainer')
          .find('.spanMessage')
          .attr('data-message');
        if (senderID === userClientId) {
          socket.emit('delete-message', messageID);
          $(this).closest('.messageContainer').remove();
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

    const room = createRoomID(userClientId, userID);
    userThatReceivesMessage = userName;
    roomName = room;

    target.find('.roundNotification').toggleClass('hidden');
    receivedMessageCount = 0;

    $('.userNameSelected').text(userName);
    $('.user-img.selected').attr('src', userPhoto);

    // Add 'selected' class to the clicked user and remove it from others
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

  const userName = $('<span>').addClass('userName').text(user.name);

  const userPhoto = $('<img>')
    .addClass('user-img')
    .attr('src', `/images/user/${user.photo} `);
  const userMessage = $('<span>').addClass('userMessage').text(message);
  const userMessageCreatedAt = $('<span>')
    .addClass('messageTime')
    .text(formattedTimeResult);

  const userElement = $('<div>')
    .addClass('users')
    .append(userName)
    .append(userPhoto)
    .append(userMessage)
    .append(userMessageCreatedAt)
    .attr('data-user-room', user.id);
  $('.listUser').append(userElement);
}

socket.on('received-message', (message) => {
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
