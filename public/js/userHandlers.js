import {
  form,
  messageInput,
  parentElement,
  chatParentElement,
  searchUserParentElement,
  searchInputForUsers,
  userSelectedToChat,
  messageFormContainer,
  getReceivedMessageCount,
  getRoomName,
  getUserThatReceivesMessage,
  setReceivedMessageCount,
  setRoomName,
  setUserThatReceivesMessage,
  userClientId,
} from './domElements.js';

import { createRoomID, renderAllUsers } from './helperFunctions.js';

const inputNumberContact = $('.form__input.phoneNumber');

export function handleFormSubmission(socket) {
  form.on('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.val();
    const selectedUser = $('.listUser .users.selected');
    if (!message || !selectedUser.length) return;

    const userID = selectedUser.data('user-room');
    const room = createRoomID(userClientId, userID);
    const userThatReceivesMessage = getUserThatReceivesMessage();
    const receivedCount = getReceivedMessageCount();

    const userMessageData = {
      message,
      room,
      userThatReceivesMessage,
      receivedCount,
    };
    socket.emit('send-message', userMessageData);

    messageInput.val('');
  });
}

export function handleUserClick(socket) {
  parentElement.on('click', '.users', (e) => {
    messageFormContainer.addClass('visible');
    userSelectedToChat.addClass('visible');

    const target = $(e.target).closest('.users');
    const userName = target.find('.userName').text();
    const userID = target.data('user-room');
    const userPhoto = target.find('.user-img').attr('src');
    const userOnline = target.attr('data-online') === 'true';
    const room = createRoomID(userClientId, userID);

    setUserThatReceivesMessage(userName);
    setRoomName(room);

    target.find('.roundNotification').toggleClass('hidden');
    setReceivedMessageCount(0);

    const statusText = userOnline ? 'online' : 'offline';
    $('.statusBall').removeClass('online offline').addClass(statusText);

    $('.userNameSelected').text(userName);
    $('.user-img.selected').attr('src', userPhoto);

    $('.users').removeClass('selected');
    target.addClass('selected');

    socket.emit('getUserMessageFromDatabase', getRoomName());
    socket.emit('join-room', getRoomName(), () => {});
  });
}

export function handleUserSearch(socket) {
  chatParentElement.on('click', '.searchTextInChatBtn', (e) => {
    e.preventDefault();

    searchInputChat.toggleClass('hidden');

    const searchQuery = searchInputChat.val().trim();
    socket.emit('getUserMessageSearched', getRoomName(), searchQuery);

    searchInputChat.val('');
  });
}

export function handleUserSearchForPhonenumber(socket) {
  inputNumberContact.on('input', (e) => {
    e.preventDefault();
    const searchQuery = e.target.value.trim();

    socket.emit('getPhoneNumberSearched', searchQuery);
  });
}

export function handleUserSearchForUsers(socket) {
  searchUserParentElement.on('click', '.searchInputUsers', (e) => {
    e.preventDefault();
    searchUserParentElement.addClass('has-focus');
  });

  searchInputForUsers.on('input', (e) => {
    e.preventDefault();
    const searchQuery = searchInputForUsers.val().trim();

    if (searchQuery.length === 0 || '') {
      renderAllUsers();
    } else {
      socket.emit('getUserSearched', searchQuery);
    }
  });
}
