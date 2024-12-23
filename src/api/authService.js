import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export const confirmCodeAuthentication = async (email,twoAuth) => {
  try {
    const response = await axios.post(`${API_URL}/auth/two-factor-auth`, { email, twoAuth });
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export async function refreshToken(token) {
  try {
    console.log('Refreshing token:', token);
    const response = await axios.post(`${API_URL}/auth/refresh-token`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Refreshed token response:', response.data.token);
    return response;
  } catch (error) {
    console.error('Refresh token error:', error); 
    throw error;
  }
}
