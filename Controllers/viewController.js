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
