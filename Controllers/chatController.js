const jwt = require('jsonwebtoken');
const Message = require('../Models/messageModel');
const { promisify } = require('util');
const User = require('../Models/userModel');
const Group = require('../Models/groupModel');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape special characters
}

const getUserIDFromToken = async (socket) => {
  try {
    const cookieHeader = socket.handshake.headers.cookie;
    if (!cookieHeader) {
      console.error('No cookie header present in the socket handshake');
      return null;
    }

    const token = cookieHeader.split('=')[1];
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
    const userID = await getUserIDFromToken(socket);

    if (!userID) return;

    await User.findByIdAndUpdate({ _id: userID }, { $set: { online: 'true' } });

    io.emit('user-status-updated', { userID, online: true });

    // Handle creating a group
    socket.on('create-group-chat', async (data) => {
      const { room, customName, members, createdBy } = data;
      try {
        const newGroup = new Group({
          name: room,
          customName: customName,
          members: members,
          createdBy: createdBy,
        });
        await newGroup.save();

        // Update the user document with the new group
        await User.findByIdAndUpdate(
          userID,
          { $push: { groups: newGroup._id } },
          { new: true }
        );

        members.forEach((memberId) => {
          socket.to(memberId).emit('group-created', newGroup);
        });

        socket.emit('group-created', newGroup); // Notify the creator as well
      } catch (err) {
        console.error('Error creating group:', err);
        socket.emit('error', 'Could not create group');
      }
    });

    // Handle sending messages
    socket.on('send-message', async (message) => {
      try {
        const userID = await getUserIDFromToken(socket);
        const userSender = await User.findById(userID);
        const isGroupMessage = message.room.startsWith('group_');
        const room = isGroupMessage
          ? message.room
          : userID + '_' + message.userThatReceivesMessage;
        const newMessage = new Message({
          message: message.message,
          room: room,
          user: userID,
          userSender: userSender.name,
          userReceiver: isGroupMessage ? null : message.userThatReceivesMessage,
          isOwner: true,
          group: isGroupMessage ? message.room : null,
        });
        await newMessage.save();
        io.to(room).emit('received-message', newMessage);
        io.to(room).emit('getUserMessageFromDatabase', room);
      } catch (err) {
        console.error('Error sending message:', err);
        socket.emit('error', 'Could not send the message properly');
      }
    });

    socket.on('messageRead', async (data) => {
      const { messageId, readerId, userReceiver } = data;
      try {
        const message = await Message.findById(messageId);
        if (message.userReceiver === userReceiver) {
          message.read = true;
          await message.save();

          // Notify the sender that the message has been read
          io.to(message.room).emit('messageReadConfirmation', {
            messageId,
          });
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });
    // Handle fetching user messages from the database
    socket.on('getUserMessageFromDatabase', async (roomName) => {
      try {
        const userMessages = await Message.find({ room: roomName });
        socket.emit('getUsersMessage', userMessages);
      } catch (err) {
        socket.emit('error', 'Could not load the messages properly');
      }
    });

    socket.on('getPhoneNumberSearched', async (phoneNumber) => {
      try {
        const user = await User.find({ phoneNumber: phoneNumber });

        socket.emit('userWithPhone', user);
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
        const result = await Message.deleteOne({ _id: messageID });
        if (result.deletedCount > 0) {
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

          searchedUserData = searchedUsers.map((user) => ({
            id: user._id,
            name: user.name,
            photo: user.photo,
          }));

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
      cb(`Joined ${room} chat`);
    });

    // Handle disconnections
    socket.on('disconnect', async () => {
      const userID = await getUserIDFromToken(socket);

      if (!userID) return;

      await User.findByIdAndUpdate(
        { _id: userID },
        { $set: { online: 'false' } }
      );

      io.emit('user-status-updated', { userID, online: false });
    });
  });
};
