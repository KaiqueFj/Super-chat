const http = require("http");
const socketIo = require("socket.io");
const app = require("./app");
const server = http.createServer(app);
const io = socketIo(server);
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Chat running on ${PORT}`);
});

// const userIo = io.of(`/user`);
// userIo.on("connection", (socket) => {
//   console.log(`Connected to user namespace`);
// });

//handle chat messages
io.on("connection", (socket) => {
  socket.on("send-message", (message, room) => {
    if (room === "") {
      socket.broadcast.emit("received-message", message);
    } else {
      socket.to(room).emit("received-message", message);
    }
    socket.on("join-room", (room, cb) => {
      socket.join(room);
      cb(`Joined ${room}`);
    });
  });
});

//handle disconnections
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
