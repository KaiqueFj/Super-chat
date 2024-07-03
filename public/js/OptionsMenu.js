import {
  addContactContainer,
  contactsContainer,
  createContactBtn,
} from './domElements';
import {
  createUserSelectedElement,
  handleEvent,
  toggleClass,
} from './helperFunctions';

const leftMenuButton = $('.circle');
const leftMenuOptions = $('.options');
const leftMenu = $('.leftMenu');
const newGroupIcon = $('.fa-solid.fa-user-group');
const newChatIcon = $('.fa-user-plus');
const containerGroup = $('.createGroupContainer');
const checkboxes = $('.user-checkbox');
const pickedUpUser = $('.pickedUserGroup');

export const handleMenuOptions = () => {
  handleEvent(leftMenuButton, 'click', () => {
    toggleClass(leftMenuOptions, 'show');

    // toggle the grow effect between both icons
    const iconElement = leftMenuButton.find('i');
    iconElement.removeClass('grow');
    void iconElement[0].offsetWidth;
    iconElement.addClass('grow');

    // Toggle Font Awesome icon
    const currentIcon = leftMenuButton.find('i').attr('class');
    if (currentIcon.includes('fa-regular fa-pen-to-square')) {
      leftMenuButton
        .find('i')
        .removeClass('fa-regular fa-pen-to-square')
        .addClass('fa-solid fa-x');
    } else {
      leftMenuButton
        .find('i')
        .removeClass('fa-solid fa-x')
        .addClass('fa-regular fa-pen-to-square');
    }
  });

  // Hide button when mouse leaves left menu
  handleEvent(leftMenu, 'mouseleave', () => {
    leftMenuButton.removeClass('show');

    // Close options if they are open
    if (leftMenuOptions.hasClass('show')) {
      leftMenuOptions.removeClass('show');
    }
  });

  handleEvent(newGroupIcon, 'click', () => {
    toggleClass(containerGroup, 'show');
  });

  handleEvent(newChatIcon, 'click', () => {
    toggleClass(contactsContainer, 'show');
  });

  // Get selected users

  checkboxes.each(function () {
    handleEvent($(this), 'change', () => {
      const selectedUsers = [];

      checkboxes.each(function () {
        if (this.checked) {
          const userId = this.value;
          const userName = $(this).closest('.users').find('.userName').text();
          const userImage = $(this)
            .closest('.users')
            .find('.user-img')
            .attr('src');

          selectedUsers.push({
            id: userId,
            username: userName,
            photo: userImage,
          });
        }
      });

      console.log(selectedUsers);

      // Clear existing selected users display
      $('.selectedUsersForGroup').empty();

      // Display selected users in the UI
      selectedUsers.forEach((user) => {
        createUserSelectedElement(user.photo, user.username);
      });
    });
  });

  // Add hover effect for selected users
  const pickedUpUsers = $(' .pickedUserGroup');
  pickedUpUsers.each(function () {
    handleEvent($(this), 'mouseenter', () => {
      $(this).addClass('highlight');
      $(this).find('.close-icon').addClass('show');
    });

    handleEvent($(this), 'mouseleave', () => {
      $(this).removeClass('highlight');
      $(this).find('.close-icon').removeClass('show');
    });
  });
};
