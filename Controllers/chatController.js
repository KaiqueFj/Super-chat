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
    socket.on('delete-message', async (messageID) => {
      try {
        const result = await Message.deleteOne({
          _id: messageID,
        });
        if (result.deletedCount > 0) {
          console.log('Message deleted successfully.');
          io.emit('message-deleted', messageID);
        } else {
          console.log('No message found with the given ID.');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    });
    socket.on('edit-message', async ({ messageID, editedMessage }) => {
      try {
        const updatedMessage = await Message.findByIdAndUpdate(
          messageID,
          { message: editedMessage },
          { new: true }
        );
        if (updatedMessage) {
          console.log('Message updated successfully.');
          io.emit('edit-message', updatedMessage);
        } else {
          console.log('No message found with the given ID.');
        }
      } catch (error) {
        console.error('Error editing message:', error);
      }
    });

    socket.on('getUserSearched', async (UserName) => {
      try {
        let searchedUserData = [];
        let searchedMessageData = [];

        if (UserName.trim() !== '') {
          const searchedUsers = await User.find({
            name: { $regex: new RegExp(escapeRegExp(UserName), 'i') },
          }).select('name photo');

          const searchedMessages = await Message.find({
            userReceiver: { $regex: new RegExp(escapeRegExp(UserName), 'i') },
          }).select('message createdAt');

          // Combine user information into one array
          searchedUserData = searchedUsers.map((user) => ({
            id: user._id,
            name: user.name,
            photo: user.photo,
          }));

          // Combine message information into one array
          searchedMessageData = searchedMessages.map((message) => ({
            message: message.message,
            createdAt: message.createdAt,
          }));
        }

        socket.emit(
          'getUserSearchedInfo',
          searchedUserData,
          searchedMessageData
        );
      } catch (error) {
        console.error(error);
      }
    });

    // Socket method used to join rooms
    socket.on('join-room', (room, cb) => {
      socket.join(room);
      cb(`Joined ${room} chat`);
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      // Handle disconnection if needed
    });
  });
};
