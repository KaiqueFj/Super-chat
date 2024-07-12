import {
  form,
  messageInput,
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
  inputNumberContact,
  searchInputChat,
  parentElementUserContainer,
  parentElementGroupContainer,
} from './domElements.js';

import {
  createRoomID,
  createUserSelectedElement,
  renderAllUsers,
  updateSelectedUserCount,
} from './helperFunctions.js';

export let selectedUsers = [];

export function handleFormSubmission(socket) {
  form.on('submit', async (e) => {
    e.preventDefault();
    const message = messageInput.val();
    const selectedElement = $(
      '.listUser .users.selected, .listGroup .group.selected'
    );
    if (!message || !selectedElement.length) return;

    let room, userID;
    if (selectedElement.hasClass('users')) {
      userID = selectedElement.data('user-room');
      room = createRoomID(userClientId, userID);
    } else if (selectedElement.hasClass('group')) {
      room = selectedElement.data('group-room');
    }

    const userThatReceivesMessage = getUserThatReceivesMessage();
    const receivedCount = getReceivedMessageCount();

    const userMessageData = {
      message,
      room,
      userThatReceivesMessage,
      receivedCount,
    };

    console.log(userMessageData);

    socket.emit('send-message', userMessageData);

    messageInput.val('');
  });
}
export function handleUserClick(socket) {
  function handleClick(event) {
    const target = $(event.target).closest('.users, .group');

    let name, id, photo, isOnline;

    if (target.hasClass('users')) {
      name = target.find('.userName').text();
      id = target.data('user-room');
      photo = target.find('.user-img').attr('src');
      isOnline = target.attr('data-online') === 'true';
    } else if (target.hasClass('group')) {
      name = target.find('.groupName').text();
      id = target.data('group-room');
      photo = target.find('.group-img').attr('src');
      isOnline = false;
    }

    const room = target.hasClass('users') ? createRoomID(userClientId, id) : id;

    messageFormContainer.addClass('visible');
    userSelectedToChat.addClass('visible');

    setUserThatReceivesMessage(name);
    setRoomName(room);

    target.find('.roundNotification').toggleClass('hidden');
    setReceivedMessageCount(0);

    const statusText = isOnline ? 'online' : 'offline';
    $('.statusBall').removeClass('online offline').addClass(statusText);

    $('.userNameSelected').text(name);
    $('.user-img.selected').attr('src', photo);

    $('.users, .group').removeClass('selected');
    target.addClass('selected');

    socket.emit('getUserMessageFromDatabase', getRoomName());
    socket.emit('join-room', getRoomName(), () => {});
  }

  parentElementUserContainer.on('click', '.users', handleClick);
  parentElementGroupContainer.on('click', '.group', handleClick);
}

export const handleUserGroup = () => {
  $('.user-checkbox').on('change', function () {
    const userId = this.value;
    const userName = $(this).closest('.users').find('.userName').text();
    const userImage = $(this).closest('.users').find('.user-img').attr('src');
    const isChecked = this.checked;

    if (isChecked) {
      selectedUsers.push({
        id: userId,
        username: userName,
        photo: userImage,
      });
    } else {
      selectedUsers = selectedUsers.filter((user) => user.id !== userId);
    }

    // Display selected users in the UI
    $('.chatMemberList').empty();
    $('.selectedUsersForGroup').empty();
    selectedUsers.forEach((user) => {
      createUserSelectedElement(user.photo, user.username);
    });

    updateSelectedUserCount(selectedUsers.length);
  });
};

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
