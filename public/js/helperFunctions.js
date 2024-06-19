import { chatContainer, userClientId } from './domElements.js';

export function formattedTime(date) {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function scrollToBottom() {
  chatContainer.scrollTop(chatContainer.prop('scrollHeight'));
}

export function createMenuItem(text, iconClass) {
  return $('<div>')
    .text(text)
    .addClass('menuItemContextMenu')
    .prepend($('<i>').addClass('fa-solid ' + iconClass));
}

export function scrollToMessage(messageID) {
  const messageElement = $(
    `.messageContainer[data-user-message="${messageID}"]`
  );
  if (messageElement.length) {
    const position = messageElement.position().top;
    chatContainer.scrollTop(position);
  }
}

export function createMessageContainer(
  message,
  messageID,
  senderID,
  createdAt
) {
  const userMessage = createUserMessage(message, messageID);
  const userMessageCreatedAt = createUserMessageCreatedAt(createdAt);

  const messageContainer = $('<div>')
    .append(userMessage)
    .append(userMessageCreatedAt)
    .addClass('messageContainer')
    .attr('data-user-message', senderID);

  messageContainer.on('contextmenu', function (event) {
    handleContextMenu(event, this, senderID);
  });

  if (userClientId === senderID) {
    const messageReadIcon = $('<i>').addClass('fa-solid fa-check-double');
    messageContainer.append(messageReadIcon);
  } else {
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

export function createRoundNotification(container, count) {
  let roundNotification = container.find('.roundNotification');
  if (roundNotification.length === 0) {
    roundNotification = $('<div>').addClass('roundNotification');
    container.append(roundNotification);
  }

  roundNotification.text(count);
}

export function createRoomID(userID1, userID2) {
  const sortedIDs = [userID1, userID2].sort();
  return sortedIDs.join('_');
}

export function createUserElement(user, message, createdAt) {
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

export function handleContextMenu(event, messageElement, senderID) {
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

export function renderAllUsers() {
  $('.listUser').empty();
  allUsers.forEach((user) => {
    createUserElement(user, user.message, user.messageTime);
  });
}
