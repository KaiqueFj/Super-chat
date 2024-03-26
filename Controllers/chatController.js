const Message = require('../Model/messageModel');
const AppError = require('../utils/AppError');

exports.chatFeatures = (io) => {
  io.on('connection', (socket) => {
    socket.on('send-message', async (message) => {
      try {
        const newMessage = new Message({
          message: message.message,
          room: message.room,
        });
        await newMessage.save();

        message.room === ''
          ? socket.broadcast.emit('received-message', message)
          : socket.to(room).emit('received-message', message);
      } catch (err) {
        return next(new AppError('Could not send the messages properly'), 400);
      }
    });

    //Function created to retrieve the user messages from the backend

    socket.on('getUsers', async () => {
      try {
        const userMessage = await Message.find();
        socket.emit('users', userMessage);
      } catch (err) {
        return next(new AppError('Could not load the messages properly'), 400);
      }
    });

    //socket method used to join rooms
    socket.on('join-room', (room, cb) => {
      socket.join(room);
      cb(`Joined ${room}`);
    });
  });

  //handle disconnections
  io.on('connection', (socket) => {
    socket.on('disconnect', () => {});
  });
};
