const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: ['must have a message'],
  },
  room: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  userSender: {
    type: String,
  },
  userReceiver: {
    type: String,
  },
  isOwner: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A message must belong to an user'],
  },
  read: { type: Boolean, default: false },
});

const Message = mongoose.model('Messages', messageSchema);

module.exports = Message;
