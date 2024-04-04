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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A message must belong to an user'],
  }, // Refcerence to User model
});

const Message = mongoose.model('Messages', messageSchema);

module.exports = Message;
