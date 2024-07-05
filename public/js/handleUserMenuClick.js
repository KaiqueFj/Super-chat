import {
  settingGearButton,
  ContainerWithUserInformations,
  returnBtn,
  OpenContainerUpdateUserBtn,
  ContainerToUpdateUser,
  OpenChatBackgroundForm,
  chatBackgroundUpdateForm,
  OpenChangePasswordForm,
  userContainerPasswordChange,
  settingsOpenButton,
  contactsContainer,
  createContactBtn,
  addContactContainer,
  groupContainerForm,
  containerGroup,
} from './domElements.js';

import { toggleClass, removeClass, handleEvent } from './helperFunctions.js';

export const settingsMenu = () => {
  handleEvent(settingGearButton, 'click', () => {
    toggleClass(ContainerWithUserInformations, 'show');
  });

  handleEvent(returnBtn, 'click', () => {
    if (ContainerWithUserInformations.hasClass('show')) {
      toggleClass(ContainerWithUserInformations, 'show');
    }
    toggleClass(containerGroup, 'show');
    removeClass(ContainerToUpdateUser, 'show');
  });

  handleEvent(OpenChatBackgroundForm, 'click', () => {
    toggleClass(chatBackgroundUpdateForm, 'show');
    toggleClass(ContainerWithUserInformations, 'show');
  });

  handleEvent(OpenContainerUpdateUserBtn, 'click', () => {
    toggleClass(ContainerToUpdateUser, 'show');
    toggleClass(chatBackgroundUpdateForm, 'show');
    toggleClass(userContainerPasswordChange, 'show');
    toggleClass(containerGroup, 'show');
    removeClass(addContactContainer, 'show');
  });

  handleEvent(OpenChangePasswordForm, 'click', () => {
    toggleClass(userContainerPasswordChange, 'show');
    toggleClass(ContainerWithUserInformations, 'show');
    removeClass(addContactContainer, 'show');
    removeClass(containerGroup, 'show');
  });
};

export const contactsMenu = () => {
  handleEvent(settingsOpenButton, 'click', () => {
    toggleClass(contactsContainer, 'show');
  });

  handleEvent(createContactBtn, 'click', () => {
    toggleClass(contactsContainer, 'show');
    toggleClass(addContactContainer, 'show');
  });

  handleEvent(returnBtn, 'click', () => {
    if (contactsContainer.hasClass('show')) {
      removeClass(contactsContainer, 'show');
    } else if (addContactContainer.hasClass('show')) {
      removeClass(addContactContainer, 'show');
    }
  });
};
