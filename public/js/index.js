/* eslint-disable */
import '@babel/polyfill';

import { signUp } from './signUp';
import { signIn, logout } from './Login';
import { toggleBackground } from './toggleBackground';
import { dropDownMenu } from './dropDownMenu';
import { settingsMenu, updateSettings } from './settingsBtn';

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

    await updateSettings(form, 'userData');
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
  await updateSettings(form, 'updateChat');
});

toggleBackground();
dropDownMenu();
settingsMenu();
