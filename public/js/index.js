/* eslint-disable */
import '@babel/polyfill';

import { signUp } from './signUp';

//DOM elements
const signUpForm = document.querySelector('.userSignIn');

if (signUpForm) {
  signUpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.querySelector('.inputName').value;
    const email = document.querySelector('.inputEmail').value;
    const password = document.querySelector('.inputPassword').value;

    signUp(name, email, password);
  });
}
