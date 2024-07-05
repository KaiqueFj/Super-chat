const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  customName: {
    type: String,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
