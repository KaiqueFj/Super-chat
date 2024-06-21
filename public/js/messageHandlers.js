import {
  createMessageContainer,
  formattedTime,
  updateSearchResults,
} from './helperFunctions.js';

import {
  userClientId,
  chatContainer,
  receivedMessageCount,
} from './domElements.js';

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

export function displayMessageInChat(message, messageID, senderID, createdAt) {
  const messageContainer = createMessageContainer(
    message,
    messageID,
    senderID,
    createdAt
  );
  chatContainer.append(messageContainer);
  return messageContainer;
}

export function socketListeners() {
  socket.on('received-message', (message) => {
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

    if (message.user === userClientId) {
      socket.emit('messageRead', {
        messageId: message._id,
        readerId: userClientId,
        userReceiver: message.userReceiver,
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

  socket.on('getUserSearchedInfo', (searchedUserData, searchedMessageData) => {
    updateSearchResults(searchedUserData, searchedMessageData);
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
}
