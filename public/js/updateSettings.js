import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
  try {
    const urlMap = {
      info: '/updateUser',
      background: '/updateChat',
      password: '/api/v1/users/updatePassword',
    };

    const url = urlMap[type];

    if (!url) {
      throw new Error('Invalid type');
    }

    const res = await axios({
      method: 'PATCH',
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
