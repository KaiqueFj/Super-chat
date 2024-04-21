const body = $('body');
const footer = $('.footer');
const header = $('.header');
const users = $('.users');
const usersSelected = $('.users.selected');
const dropDownMenuList = $('.dropDownMenuList');
const leftMenu = $('.leftMenu');
const messageFormContainer = $('.messageFormContainer');
const inputBox = $('.inputBox');
const messageOwnerFalse = $('.messageContainer.owner-false');
const userSelectedToChat = $('.userSelectedChat');
const messageInput = $('.inputMessage');
const chatContainer = $('.messageList');
const searchInputChat = $('.searchInput');
const searchIcon = $('.fa-solid.fa-magnifying-glass');
const sendMessageIcon = $('.fa-regular.fa-paper-plane');
const toggleBackgroundButton = $('.dropDownMenuBtns.toggleBackground');
const userNameSelected = $('.userNameSelected');

export const toggleBackground = () => {
  toggleBackgroundButton.on('click', function (e) {
    e.preventDefault();
    chatContainer
      .add(body)
      .add(footer)
      .add(header)
      .add(messageFormContainer)
      .toggleClass('light-mode');

    users.toggleClass('light-mode-leftMenu-users-hover-color');
    usersSelected.toggleClass('light-mode usersselected');

    leftMenu.toggleClass('light-mode-leftMenu');
    dropDownMenuList.toggleClass('light-mode-dropDownMenuList');
    messageInput.toggleClass('light-mode-inputMessage');
    userSelectedToChat.toggleClass('light-mode-inputMessage');
    inputBox.toggleClass('light-mode-inputMessage');
    searchInputChat.toggleClass('light-mode-userSearch');

    messageOwnerFalse.toggleClass('light-mode-messageContainerFalse');
    userNameSelected.toggleClass('light-mode-userNameSelected');
    sendMessageIcon.toggleClass('light-mode-icons-sendPlane');
    searchIcon.toggleClass('light-mode-icons-searchIcon');
  });
};