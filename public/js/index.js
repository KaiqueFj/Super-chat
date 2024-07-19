/* eslint-disable */
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { signUp } from './handleUserFunctions/signUp.js';
import { signIn, logout } from './handleUserFunctions/Login';
import { toggleBackground } from './handleClicks/toggleBackground.js';
import { dropDownMenu } from './handleClicks/dropDownMenu.js';
import { updateSettings } from './handleUserFunctions/updateSettings.js';
import {
  settingsMenu,
  contactsMenu,
} from './handleClicks/handleUserMenuClick.js';
import { createContact } from './handleUserFunctions/addUserContact.js';
import {
  handleFormSubmission,
  handleUserClick,
  handleUserGroup,
  handleUserSearch,
  handleUserSearchForPhonenumber,
  handleUserSearchForUsers,
  selectedUsers,
} from './handleChatFunction/userHandlers.js';
import { socketListeners } from './handleChatFunction/messageHandlers.js';

import {
  signUpForm,
  signInForm,
  logoutBtn,
  updateUserForm,
  userPhoto,
  userPhotoConfig,
  photoInput,
  userPhoneNumber,
  userBiography,
  updateUserChat,
  backgroundImage,
  chatBackgroundInput,
  backgroundOfMessageContainer,
  updateUserPassword,
  createContactContainer,
  groupForm,
  groupPhoto,
  groupPhotoPrev,
} from './handleInteration/domElements.js';
import { handleMenuOptions } from './handleClicks/OptionsMenu.js';
import { createGroup } from './/handleUserFunctions/groupCreate.js';

// Ensure that the socket.io client script is loaded
document.addEventListener('DOMContentLoaded', () => {
  const socket = io();

  socketListeners(socket);

  handleFormSubmission(socket);
  handleUserClick(socket);
  handleUserSearch(socket);
  handleUserSearchForUsers(socket);
  handleUserSearchForPhonenumber(socket);
  handleUserGroup();
});

// DOM elements

if (logoutBtn) logoutBtn.addEventListener('click', logout);

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.inputName').value;
    const email = document.querySelector('.inputEmail').value;
    const password = document.querySelector('.inputPassword').value;

    signUp(name, email, password);
  });
}

if (signInForm) {
  signInForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.querySelector('.inputEmail').value;
    const password = document.querySelector('.inputPassword').value;

    signIn(email, password);
  });
}

if (groupPhoto) {
  groupPhoto.on('change', () => {
    const file = groupPhoto[0].files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      groupPhotoPrev.attr('src', e.target.result);
    };

    reader.readAsDataURL(file);
  });
}

if (groupForm) {
  groupForm.on('submit', async (e) => {
    e.preventDefault();
    const customName = $('#customName').val();
    const fileInput = $('#groupPhoto')[0];

    if (fileInput.files.length === 0) {
      console.error('No file selected.');
      return;
    }

    const form = new FormData();
    form.append('customName', customName);
    selectedUsers.forEach((user) => form.append('members', user.id));
    form.append('groupPhoto', fileInput.files[0]);

    await createGroup(form, 'group');
  });
}

if (updateUserForm) {
  photoInput.addEventListener('change', () => {
    const file = photoInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      userPhoto.src = e.target.result;
      userPhotoConfig.src = e.target.result;
    };

    reader.readAsDataURL(file);
  });

  if (updateUserForm) {
    updateUserForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('biography', document.getElementById('biography').value);
      form.append('phoneNumber', document.getElementById('phoneNumber').value);
      form.append('photo', document.getElementById('photo').files[0]);

      userPhoneNumber.textContent =
        document.getElementById('phoneNumber').value;

      userBiography.textContent = document.getElementById('biography').value;

      await updateSettings(form, 'info');
    });
  }
}

if (updateUserChat) {
  chatBackgroundInput.addEventListener('change', () => {
    const file = chatBackgroundInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      backgroundImage.src = e.target.result;
      backgroundOfMessageContainer.style.backgroundImage = `url(${e.target.result})`;
    };

    reader.readAsDataURL(file);
  });
}

if (updateUserChat) {
  updateUserChat.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('wallpaper', document.getElementById('wallpaper').files[0]);
    await updateSettings(form, 'background');
  });
}

if (updateUserPassword) {
  updateUserPassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    await updateSettings(
      { currentPassword, password, passwordConfirm },
      'password'
    );
  });
}

if (createContactContainer) {
  createContactContainer.addEventListener('submit', async (e) => {
    e.preventDefault();
    const phoneNumber = document.getElementById('phoneNumberContact').value;
    const nickname = document.getElementById('nickNameContact').value;
    const contactUser = document.querySelector('.users').dataset.userRoom;

    await createContact({ phoneNumber, nickname, contactUser }, 'contact');
  });
}

toggleBackground();
dropDownMenu();
settingsMenu();
contactsMenu();
handleMenuOptions();
