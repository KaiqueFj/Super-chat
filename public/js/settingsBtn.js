const settingsDiv = $('.menuItem.settings');
const settingsMenuDiv = $('.configurationsMenu');
const settingsBtn = $('.settingsBtn');
const updateUserBtn = $('.settingsBtn.edit-user-info');
const userFormUpdateData = $('.form.form-user-data');
import axios from 'axios';
import { showAlert } from './alert';

export const settingsMenu = () => {
  settingsDiv.on('click', function (e) {
    e.preventDefault();

    settingsMenuDiv.toggleClass('show');
  });

  settingsBtn.on('click', function (e) {
    e.preventDefault();
    settingsMenuDiv.toggleClass('show');
  });

  updateUserBtn.on('click', function (e) {
    e.preventDefault();
    userFormUpdateData.toggleClass('show');
  });
};

// type is either password or data
export const updateSettings = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/updateUser',
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
