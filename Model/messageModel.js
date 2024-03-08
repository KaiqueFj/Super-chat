const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: ['must have a message'],
  },
  room: {
    type: String,
  },
});

const Message = mongoose.model('Messages', messageSchema);

module.exports = Message;
