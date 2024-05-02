import axios from 'axios';
import { showAlert } from './alert';

export const signUp = async (name, email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name: name,
        email: email,
        password: password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'created an account successfully! ');
      window.setTimeout(() => {
        location.assign('/login');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
