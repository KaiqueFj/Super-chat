const User = require('../Model/userModel');

exports.getChatPage = (req, res) => {
  res.status(200).render('overview', {
    title: 'Your account',
  });
};

exports.getSignUpPageUser = (req, res) => {
  res.status(200).render('signUp', {
    title: 'Your account',
  });
};

exports.getLogInPageUser = (req, res) => {
  res.status(200).render('Login', {
    title: 'Your account',
  });
};
