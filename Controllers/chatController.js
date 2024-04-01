const jwt = require('jsonwebtoken');
const Message = require('../Model/messageModel');
const User = require('../Model/userModel');
const AppError = require('../utils/AppError');
const { promisify } = require('util');

exports.chatFeatures = (io) => {
  io.on('connection', async (socket) => {
    socket.on('send-message', async (message) => {
      try {
        const token = socket.handshake.headers.cookie.split('=')[1];
        if (token) {
          const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
          );

          const currentUser = await User.findById(decoded.id);

          const newMessage = new Message({
            message: message.message,
            room: message.room,
            user: currentUser.id,
          });
          await newMessage.save();

          message.room === ''
            ? socket.broadcast.emit('received-message', message)
            : socket.to(room).emit('received-message', message);
        }
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('error', 'Could not send the message properly');
      }
    });

    socket.on('getUserMessageFromDatabase', async () => {
      try {
        const userMessages = await Message.find();
        socket.emit('getUsersMessage', userMessages);
      } catch (err) {
        console.error('Error retrieving user messages:', err);
        socket.emit('error', 'Could not load the messages properly');
      }
    });

    // Socket method used to join rooms
    socket.on('join-room', (room, cb) => {
      socket.join(room);
      cb(`Joined ${room}`);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      // Handle disconnection if needed
    });
  });
};
