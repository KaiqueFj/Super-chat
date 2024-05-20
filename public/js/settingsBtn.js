const settingGearButton = $('.menuItem.settings');
const ContainerWithUserInformations = $('.configurationsMenu');
const returnBtn = $('.settingsBtn');
const OpenContainerUpdateUserBtn = $('.settingsBtn.edit-user-info');
const ContainerToUpdateUser = $('.updateUserContainer');
const OpenChatBackgroundForm = $('.listUserItems.backgroundImg');
const chatBackgroundUpdateForm = $('.updateUserContainer.chat');

import axios from 'axios';
import { showAlert } from './alert';

// type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url = type === 'userData' ? '/updateUser' : '/updateChat';

    const res = await axios({
      method: 'PATCH',
      url,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', ` updated successfully`);
    }

    return res.data;
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const settingsMenu = () => {
  settingGearButton.on('click', function (e) {
    e.preventDefault();

    ContainerWithUserInformations.toggleClass('show');
  });

  returnBtn.on('click', function (e) {
    e.preventDefault();
    ContainerWithUserInformations.toggleClass('show');
    ContainerToUpdateUser.removeClass('show');
  });

  OpenChatBackgroundForm.on('click', function (e) {
    e.preventDefault();
    chatBackgroundUpdateForm.toggleClass('show');
    ContainerWithUserInformations.toggleClass('show');
  });

  OpenContainerUpdateUserBtn.on('click', function (e) {
    e.preventDefault();
    ContainerToUpdateUser.toggleClass('show');
    chatBackgroundUpdateForm.toggleClass('show');
  });
};
