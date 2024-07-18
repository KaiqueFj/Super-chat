// domElements.js

// Drop downMenu
export const dropDownMenuBtn = $('.dropBtn');
export const dropDownMenuItems = $('.dropDownItems');

// OptionsMenu
export const leftMenuButton = $('.circle');
export const leftMenuOptions = $('.options');
export const newGroupIcon = $('.fa-solid.fa-user-group');
export const newChatIcon = $('.fa-user-plus');
export const containerGroup = $('.createGroupContainer');
export const forwardGroupButton = $('.forwardGroup');
export const groupContainerForm = $('.updateUserContainer.groupInfo');
export const inputNumberContact = $('.form__input.phoneNumber');
export const groupForm = $('.updateUserContainer.groupInfo');
export const groupPhoto = $('#groupPhoto');
export const groupPhotoPrev = $('.form__user-photo.group-pic');

// Toggle Background
export const body = $('body');
export const html = $('html');
export const main = $('main');
export const footer = $('.footer');
export const header = $('.header');
export const users = $('.users');
export const groups = $('.group');
export const spanUsername = $('.userName');
export const groupName = $('.groupName');
export const messageForm = $('.messageFormContainer');
export const userMessage = $('.userMessage');
export const messageTime = $('.messageTime');
export const searchUsersContainerLeftMenu = $('.searchForUsers');
export const searchInputUsers = $('.searchInputUsers');
export const usersSelected = $('.users.selected');
export const groupSelected = $('.group.selected');
export const leftMenu = $('.leftMenu');
export const leftMenuThumb = $('.leftMenu::-webkit-scrollbar-thumb');
export const leftMenuTrack = $('.leftMenu::-webkit-scrollbar-track');
export const leftMenuTrackPiece = $('.leftMenu::-webkit-scrollbar-track-piece');
export const leftMenuCorner = $('.leftMenu::-webkit-scrollbar-corner');
export const inputBox = $('.inputBox');
export const searchIcon = $('.fa-solid.fa-magnifying-glass');
export const barsIcon = $('.fa-solid.fa-bars');
export const sendMessageIcon = $('.fa-regular.fa-paper-plane');
export const toggleBackgroundButton = $('.menuItem.toggleBackground');
export const userNameSelected = $('.userNameSelected');
export const sunIcon = $('.fa-regular.fa-sun');
export const moonIcon = $('.fa-solid.fa-moon');
export const menuItemDarkModeText = $('.menuItemName.toggleBackground');

//Menu Elements
export const settingGearButton = $('.menuItem.settings');
export const ContainerWithUserInformations = $('.configurationsMenu');
export const returnBtn = $('.settingsBtn');
export const OpenContainerUpdateUserBtn = $('.settingsBtn.edit-user-info');
export const ContainerToUpdateUser = $('.updateUserContainer');
export const OpenChatBackgroundForm = $('.listUserItems.backgroundImg');
export const chatBackgroundUpdateForm = $('.updateUserContainer.chat');
export const OpenChangePasswordForm = $('.listUserItems.changePassword');
export const userContainerPasswordChange = $('.updateUserContainer.password');
export const settingsOpenButton = $('.menuItem.contacts');
export const contactsContainer = $('.contactsContainer');
export const createContactBtn = $('.createContactBtn');
export const addContactContainer = $('.updateUserContainer.contacts');

// Chat Elements
export const form = $('.form-input');
export const messageInput = $('.inputMessage');
export const parentElementUserContainer = $('.listUser');
export const parentElementGroupContainer = $('.listGroup');
export const chatContainer = $('.messageList');
export const chatParentElement = $('.searchForm');
export const searchUserParentElement = $('.searchForUsers');
export const searchInputForUsers = $('.searchInputUsers');
export const searchInputChat = $('.searchInput');
export const userSelectedToChat = $('.userSelectedChat');
export const messageFormContainer = $('.messageFormContainer');

//Menu elements 1
export const signUpForm = document.querySelector('.userSignIn');
export const signInForm = document.querySelector('.userLogIn');
export const logoutBtn = document.querySelector('.menuItem.logout');
export const updateUserForm = document.querySelector('.form-user-data');
export const userPhoto = document.querySelector('.form__user-photo');
export const userPhotoConfig = document.querySelector('.user-img-settings');
export const photoInput = document.getElementById('photo');
export const userPhoneNumber = document.querySelector(
  '.userName-settings.userPhoneNumber'
);
export const userBiography = document.querySelector(
  '.userName-settings.userBiography'
);
export const updateUserChat = document.querySelector(
  '.updateUserContainer.chat'
);
export const backgroundImage = document.querySelector('.form__user-photo.chat');
export const chatBackgroundInput = document.getElementById('wallpaper');
export const backgroundOfMessageContainer = document.querySelector(
  '.messageFormContainer'
);
export const updateUserPassword = document.querySelector(
  '.updateUserContainer.password'
);

export const createContactContainer = document.querySelector(
  '.updateUserContainer.contacts'
);

export let receivedMessageCount = 0;
export const userClientId = window.userLoggedInId || null;

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
