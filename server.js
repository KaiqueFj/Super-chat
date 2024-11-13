const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const app = require('./app');
const server = http.createServer(app);
const io = socketIo(server);
const dotenv = require('dotenv');
const chatController = require('./Controllers/chatController');
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
chatController.chatFeatures(io);
