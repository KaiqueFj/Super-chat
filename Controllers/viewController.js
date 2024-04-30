const User = require('../Model/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getChatPage = catchAsync(async (req, res) => {
  const users = await User.find().populate({
    path: 'messages',
  });

  const preparedMessages = users.flatMap((user) => user.messages);

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('overview', {
    title: 'Your account',
    users: users,
    message: preparedMessages,
    userUpdated: updatedUser,
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

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('overview', {
    title: 'Your account',
    user: updatedUser,
  });
});
