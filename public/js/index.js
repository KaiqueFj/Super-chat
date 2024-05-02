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
  updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('biography', document.getElementById('biography').value);
    form.append('photo', document.getElementById('photo').files[0]);

    console.log(form);

    try {
      const res = await updateSettings(form);
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  });
}

toggleBackground();
dropDownMenu();
settingsMenu();
