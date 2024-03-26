const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: ['must have a message'],
  },
  room: {
    type: String,
  },
  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

const Message = mongoose.model('Messages', messageSchema);

module.exports = Message;
