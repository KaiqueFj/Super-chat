const jwt = require('jsonwebtoken');
const Message = require('../Model/messageModel');
const User = require('../Model/userModel');
const { promisify } = require('util');

exports.chatFeatures = (io) => {
  io.on('connection', async (socket) => {
    socket.on('send-message', async (message, next) => {
      try {
        const token = socket.handshake.headers.cookie.split('=')[1];
        if (token) {
          const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
          );

          if (!decoded) return next();

          const currentUser = await User.findById(decoded.id);
          if (!currentUser) return next();

          const newMessage = new Message({
            message: message.message,
            room: message.room,
            user: currentUser.id,
            isOwner: true,
          });
          await newMessage.save();

          message.room === ''
            ? socket.broadcast.emit('received-message', message)
            : socket.to(room).emit('received-message', message);
        }
      } catch (err) {
        socket.emit('error', 'Could not send the message properly');
      }
    });

    socket.on('getUserMessageFromDatabase', async (roomName) => {
      try {
        const userMessages = await Message.find({ room: roomName });
        socket.emit('getUsersMessage', userMessages);
      } catch (err) {
        console.error('Error retrieving user messages:', err);
        socket.emit('error', 'Could not load the messages properly');
      }
    });

    // Socket method used to join rooms
    socket.on('join-room', (room, cb) => {
      socket.join(room);
      cb(`Joined ${room} chat`);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      // Handle disconnection if needed
    });
  });
};
