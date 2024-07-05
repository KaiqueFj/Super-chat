import { contactsContainer } from './domElements';
import { handleEvent, removeClass, toggleClass } from './helperFunctions';
import {
  leftMenuButton,
  leftMenuOptions,
  leftMenu,
  newGroupIcon,
  newChatIcon,
  containerGroup,
  forwardGroupButton,
  groupContainerForm,
  returnBtn,
} from './domElements.js';

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

  //Click on forwardButton to open groupInfo
  handleEvent(forwardGroupButton, 'click', () => {
    toggleClass(groupContainerForm, 'show');
    containerGroup.removeClass('show');
  });

  handleEvent(returnBtn, 'click', () => {
    // Check for specific contexts before toggling
    if (groupContainerForm.hasClass('show')) {
      groupContainerForm.removeClass('show');
    } else if (containerGroup.hasClass('show')) {
      removeClass(containerGroup, 'show');
    }
  });
};
