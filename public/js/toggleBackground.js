const body = $('body');
const footer = $('.footer');
const header = $('.header');
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

    leftMenu.toggleClass('light-mode-leftMenu');
    messageInput.toggleClass('light-mode-inputMessage');
    userSelectedToChat.toggleClass('light-mode-inputMessage');
    searchInputChat.toggleClass('light-mode-userNameSelected');
    inputBox.toggleClass('light-mode-inputMessage');

    messageOwnerFalse.toggleClass('light-mode-messageContainerFalse');
    userNameSelected.toggleClass('light-mode-userNameSelected');
    searchIcon.add(sendMessageIcon).toggleClass('fa.icons');
  });
};
