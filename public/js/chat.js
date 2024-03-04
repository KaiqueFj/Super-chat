const form = document.querySelector(".form-input");
const messageInput = document.querySelector(".inputMessage");
const roomInput = document.querySelector(".inputRoom");
const messages = document.querySelector("messageList");
const btnJoin = document.querySelector(".join");

//capture the message
socket.on("received-message", (message) => {
  displayMessage(message);
});

//forms used to put the message and room to be sent by the user
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  const room = roomInput.value;
  if (message === "") return;

  displayMessage(message);

  socket.emit("send-message", {user:room, message});

  messageInput.value = "";
});

//btn used to enter in room
btnJoin.addEventListener("click", () => {
  const room = roomInput.value;
  socket.emit("join-room", room, (message) => {
    displayMessage(message);
  });
});

//function used to display the messages in the form
function displayMessage(message) {
  $(".messageList").append($("<li>").text(message));
}
