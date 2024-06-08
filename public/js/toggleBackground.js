const body = $('body');
const html = $('html');
const main = $('main');
const footer = $('.footer');
const header = $('.header');
const users = $('.users');
const spanUsername = $('.userName');
const userMessage = $('.userMessage');
const messageTime = $('.messageTime');
const searchUsersContainerLeftMenu = $('.searchForUsers');
const searchInputUsers = $('.searchInputUsers');
const usersSelected = $('.users.selected');
const dropDownMenuList = $('.dropDownMenuList');
const leftMenu = $('.leftMenu');
const inputBox = $('.inputBox');
const messageOwnerFalse = $('.messageContainer.owner-false');
const userSelectedToChat = $('.userSelectedChat');
const messageInput = $('.inputMessage');
const searchInputChat = $('.searchInput');
const searchIcon = $('.fa-solid.fa-magnifying-glass');
const sendMessageIcon = $('.fa-regular.fa-paper-plane');
const toggleBackgroundButton = $('.menuItem.toggleBackground');
const userNameSelected = $('.userNameSelected');
const sunIcon = $('.fa-regular.fa-sun');
const moonIcon = $('.fa-solid.fa-moon');
const menuItemDarkModeText = $('.menuItemName.toggleBackground');

export const toggleBackground = () => {
  let isSunVisible = true; // Track the current state of the icons

  toggleBackgroundButton.on('click', function (e) {
    e.preventDefault();
    html
      .add(body)
      .add(footer)
      .add(header)
      .add(main)
      .add(leftMenu)
      .toggleClass('light-mode');

    searchUsersContainerLeftMenu
      .add(searchInputUsers)
      .add(searchInputChat)
      .add(messageInput)
      .add(inputBox)

      .toggleClass('light-mode-color-details');

    // User username, message, time - white background
    spanUsername
      .add(userNameSelected)
      .add(messageInput)
      .toggleClass('light-mode-color-details-text');

    userMessage
      .add(messageTime)
      .add(searchIcon)
      .add(searchInputChat)
      .add(sendMessageIcon)
      .toggleClass('light-mode-color-details-subText');

    users.toggleClass('light-mode-color-hover');

    usersSelected.toggleClass('light-mode usersselected');

    // Toggle visibility of sun and moon icons based on the current state
    if (isSunVisible) {
      sunIcon.css('display', 'none');
      moonIcon.css('display', 'block');
      menuItemDarkModeText.text('Dark mode'); // Change button text
    } else {
      sunIcon.css('display', 'block');
      moonIcon.css('display', 'none');
      menuItemDarkModeText.text('Light mode'); // Change button text
    }

    // Update the state of the icons
    isSunVisible = !isSunVisible;
  });
};
