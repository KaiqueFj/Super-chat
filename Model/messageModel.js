const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  message: {
    type: String,
    required: ["must have a message"],
  },
});

const Message = mongoose.model("Messages", messageSchema);

module.exports = Message;
