const User = require('../Model/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getChatPage = catchAsync(async (req, res) => {
  const users = await User.find().populate({
    path: 'messages',
  });

  res.status(200).render('overview', {
    title: 'Your account',
    users: users,
  });
});

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
