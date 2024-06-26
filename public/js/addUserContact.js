import axios from 'axios';
import { showAlert } from './alert';

export const createContact = async (data, type) => {
  try {
    const urlMap = {
      contact: '/api/v1/users/addContact',
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
        'Content-Type': 'application/json',
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type} created successfully`);
    }

    return res.data;
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
