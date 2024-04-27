/* eslint-disable */
import '@babel/polyfill';

import { signUp } from './signUp';
import { signIn, logout } from './Login';
import { toggleBackground } from './toggleBackground';
import { dropDownMenu } from './dropDownMenu';
import { settingsMenu } from './settingsBtn';

//DOM elements
const signUpForm = document.querySelector('.userSignIn');
const signInForm = document.querySelector('.userLogIn');
const logoutBtn = document.querySelector('.menuItem.logout');

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

toggleBackground();
dropDownMenu();
settingsMenu();
