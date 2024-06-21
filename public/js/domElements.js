// domElements.js

export const form = $('.form-input');
export const messageInput = $('.inputMessage');
export const parentElement = $('.listUser');
export const chatContainer = $('.messageList');
export const chatParentElement = $('.searchForm');
export const searchUserParentElement = $('.searchForUsers');
export const searchInputForUsers = $('.searchInputUsers');
export const searchInputChat = $('.searchInput');
export const userSelectedToChat = $('.userSelectedChat');
export const messageFormContainer = $('.messageFormContainer');

export let receivedMessageCount = 0;
export const userClientId = userLoggedInId;
let userThatReceivesMessage = null;
let roomName = null;
export let allUsers = [];
export let clientId = userClientId;

// Getter and setter for userThatReceivesMessage
export function setUserThatReceivesMessage(userName) {
  userThatReceivesMessage = userName;
}

export function getUserThatReceivesMessage() {
  return userThatReceivesMessage;
}

// Getter and setter for roomName
export function setRoomName(room) {
  roomName = room;
}

export function getRoomName() {
  return roomName;
}

// Getter and setter for receivedMessageCount
export function setReceivedMessageCount(count) {
  receivedMessageCount = count;
}

export function getReceivedMessageCount() {
  return receivedMessageCount;
}
