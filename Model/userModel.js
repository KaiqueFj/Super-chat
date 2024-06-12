const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ['A user must have a name'],
    },
    email: {
      type: String,
      required: ['A user must have an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    biography: {
      type: String,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'A user must have a password'],
      minlength: 8,
      select: false,
    },
    online: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      default: 'default.jpg',
    },
    wallpaper: {
      type: String,
      default: 'default.jpg',
    },
  },
  {
    toJSON: { virtuals: true },

    toObject: { virtuals: true },
  }
);

// Virtual populate
userSchema.virtual('messages', {
  ref: 'Messages',
  foreignField: 'user',
  localField: '_id',
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // Check if both arguments are defined
  if (!candidatePassword || !userPassword) {
    throw new Error('data and hash arguments required');
  }
  return await bcrypt.compare(candidatePassword, userPassword);
};
const User = mongoose.model('User', userSchema);

module.exports = User;
