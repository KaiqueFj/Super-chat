const User = require('../Models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getChatPage = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId)
    .populate({
      path: 'contacts',
      populate: {
        path: 'contactUser',
        model: 'User',
      },
    })
    .populate({
      path: 'messages',
      options: { sort: { createdAt: -1 } },
    });

  res.status(200).render('overview', {
    user: user,
    contacts: user.contacts,
    messages: user.messages,
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
