import axios from 'axios';
import { showAlert } from '../handleAlertPage/alert';

export const createGroup = async (data, type) => {
  try {
    const urlMap = {
      group: '/api/v1/users/createGroup',
    };

    const url = urlMap[type];

    if (!url) {
      throw new Error('Invalid type');
    }

    const res = await axios({
      method: 'POST',
      url,
      data,
      headers: {
        'Content-Type':
          type === 'password' ? 'application/json' : 'multipart/form-data',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type} updated successfully`);
    }

    return res.data;
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
