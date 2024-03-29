/* eslint-disable */
import '@babel/polyfill';

import { signUp } from './signUp';
import { signIn } from './Login';

//DOM elements
const signUpForm = document.querySelector('.userSignIn');
const signInForm = document.querySelector('.userLogIn');

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
