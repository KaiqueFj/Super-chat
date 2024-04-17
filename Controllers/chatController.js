const jwt = require('jsonwebtoken');
const Message = require('../Model/messageModel');
const { promisify } = require('util');
const User = require('../Model/userModel');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
}

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
    // Handle sending messages
    socket.on('send-message', async (message) => {
      try {
        const userID = await getUserIDFromToken(socket);
        const userSender = await User.findById(userID);

        // Create a new message object
        const newMessage = new Message({
          message: message.message,
          room: message.room,
          user: userID,
          userSender: userSender.name,
          userReceiver: message.userReceived,
          isOwner: true,
        });

        await newMessage.save();

        // Emit the saved message to the room
        io.to(message.room).emit('received-message', newMessage);

        // Fetch messages for the specific room and emit them to the sender
        io.to(message.room).emit('getUserMessageFromDatabase', message.room);
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('error', 'Could not send the message properly');
      }
    });

    // Handle fetching user messages from the database
    socket.on('getUserMessageFromDatabase', async (roomName) => {
      try {
        // Fetch messages for the specific user in the room
        const userMessages = await Message.find({
          room: roomName,
        });

        socket.emit('getUsersMessage', userMessages);
      } catch (err) {
        socket.emit('error', 'Could not load the messages properly');
      }
    });

    socket.on('getUserMessageSearched', async (roomName, messagesUser) => {
      try {
        let searchedMessage;

        messagesUser.trim() === ''
          ? (searchedMessage = [])
          : (searchedMessage = await Message.find({
              message: { $regex: new RegExp(escapeRegExp(messagesUser), 'i') },
              room: roomName,
            }));

        socket.emit('getMessagesSearched', searchedMessage);
      } catch (err) {
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
