import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { signUp } from './signUp';
import { signIn, logout } from './Login';
import { toggleBackground } from './toggleBackground';
import { dropDownMenu } from './dropDownMenu';
import { updateSettings } from './updateSettings';
import { settingsMenu } from './handleUserMenuClick';
import {
  handleFormSubmission,
  handleUserClick,
  handleUserSearch,
  handleUserSearchForUsers,
} from './userHandlers.js';
import { socketListeners } from './messageHandlers.js';

//DOM elements
const signUpForm = document.querySelector('.userSignIn');
const signInForm = document.querySelector('.userLogIn');
const logoutBtn = document.querySelector('.menuItem.logout');
const updateUserForm = document.querySelector('.form-user-data');
const userPhoto = document.querySelector('.form__user-photo');
const userPhotoConfig = document.querySelector('.user-img-settings');
const photoInput = document.getElementById('photo');
const userBiography = document.querySelector(
  '.userName-settings.userBiography'
);
const updateUserChat = document.querySelector('.updateUserContainer.chat');
const backgroundImage = document.querySelector('.form__user-photo.chat');
const chatBackgroundInput = document.getElementById('wallpaper');
const backgroundOfMessageContainer = document.querySelector(
  '.messageFormContainer'
);
const updateUserPassword = document.querySelector(
  '.updateUserContainer.password'
);

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

  updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('biography', document.getElementById('biography').value);
    form.append('photo', document.getElementById('photo').files[0]);

    userBiography.textContent = document.getElementById('biography').value;

    await updateSettings(form, 'info');
  });
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

updateUserChat.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('wallpaper', document.getElementById('wallpaper').files[0]);
  await updateSettings(form, 'background');
});

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

// Initialize event handlers
handleFormSubmission();
handleUserClick();
handleUserSearch();
handleUserSearchForUsers();

// Initialize socket listeners
socketListeners();

toggleBackground();
dropDownMenu();
settingsMenu();
