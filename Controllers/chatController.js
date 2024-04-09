const jwt = require('jsonwebtoken');
const Message = require('../Model/messageModel');
const { promisify } = require('util');

const getUserIDFromToken = async (socket) => {
  try {
    const token = socket.handshake.headers.cookie.split('=')[1];
    if (token) {
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_SECRET
      );

      if (!decoded) return null;

      return decoded.id;
    }
    return null;
  } catch (error) {
    console.error('Error while extracting user ID from token:', error);
    return null;
  }
};

exports.chatFeatures = (io) => {
  io.on('connection', async (socket) => {
    socket.on('send-message', async (message, next) => {
      try {
        const userID = await getUserIDFromToken(socket);

        const newMessage = new Message({
          message: message.message,
          room: message.room,
          user: userID,
          isOwner: true,
        });
        await newMessage.save();

        message.room === ''
          ? socket.broadcast.emit('received-message', message)
          : socket.to(room).emit('received-message', message);
      } catch (err) {
        socket.emit('error', 'Could not send the message properly');
      }
    });

    socket.on('getUserMessageFromDatabase', async (roomName) => {
      try {
        const userID = await getUserIDFromToken(socket);
        const userMessages = await Message.find({
          room: roomName,
          user: userID,
        });
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
