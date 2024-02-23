const mongoose = require("mongoose");
const User = require("../Model/userModel");

exports.signUp = async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  res.status(200).json({
    status: "success",
    data: newUser,
  });
};
