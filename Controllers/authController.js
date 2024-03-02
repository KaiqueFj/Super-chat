const jwt = require("jsonwebtoken")
const User = require("../Model/userModel");
const AppError = require("../utils/AppError");

const signToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
 
  // hides the output password
  user.password = undefined

  res.status(statusCode).json({

   status: 'success',
    token,
    data: {
      user,
    },
  });
};


exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  createSendToken(newUser,201,res)
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  //1 - check if email and password exist
  if (!email || !password) {
    return next(new AppError("please, provide email and password"), 400);
  }

  //2 - check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }

  //3 - if everything is ok, send token to client
  createSendToken(user, 200,res)
}