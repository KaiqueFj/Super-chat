import {
  body,
  html,
  main,
  footer,
  header,
  users,
  spanUsername,
  messageForm,
  userMessage,
  messageTime,
  searchUsersContainerLeftMenu,
  searchInputUsers,
  usersSelected,
  leftMenu,
  inputBox,
  messageInput,
  searchInputChat,
  searchIcon,
  barsIcon,
  sendMessageIcon,
  toggleBackgroundButton,
  userNameSelected,
  sunIcon,
  moonIcon,
  menuItemDarkModeText,
} from '../handleInteration/domElements.js';

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
      .add(searchInputChat)
      .add(messageInput)
      .add(inputBox)
      .toggleClass('light-mode-color-details');

    // User username, message, time - white background
    spanUsername
      .add(userNameSelected)
      .toggleClass('light-mode-color-details-text');

    userMessage
      .add(messageTime)
      .add(searchIcon)
      .add(searchInputChat)
      .add(sendMessageIcon)
      .add(barsIcon)
      .toggleClass('light-mode-color-details-subText');

    users.toggleClass('light-mode-color-hover');

    usersSelected.toggleClass('light-mode usersselected');

    messageForm.toggleClass('light-mode-color-container');

    inputBox
      .add(searchInputUsers)
      .add(searchUsersContainerLeftMenu)
      .add(searchInputChat)
      .add(messageInput)
      .toggleClass('light-mode-color-input');

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
