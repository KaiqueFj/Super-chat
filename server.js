const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const app = require('./app');
const server = http.createServer(app);
const dotenv = require('dotenv');
const Message = require('./Model/messageModel');
const io = socketIo(server);
dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Chat running on ${PORT}`);
});

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log(`DB connection successfully established`));

process.on('uncaughtException', (err) => {
  console.log('UncaughtException, shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

//handles the chat message
io.on('connection', (socket) => {
  socket.on('send-message', async (message) => {
    try {
      const newMessage = new Message({
        message: message.message,
        room: message.room,
      });
      await newMessage.save();
      if (message.room === '') {
        socket.broadcast.emit('received-message', message);
      } else {
        socket.to(room).emit('received-message', message);
      }
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('getUsers', async () => {
    try {
      const userMessage = await Message.find();
      socket.emit('users', userMessage);
    } catch (err) {
      console.error(err);
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
