import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found, please log in');
  }
  return token;
};

export const fetchMagasins = async (page) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/market?page=${page}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addMagasin = async (magasin) => {
  const token = getToken();
  const response = await axios.post(`${API_URL}/market`, magasin, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteMagasin = async (id) => {
  const token = getToken();
  await axios.delete(`${API_URL}/market/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const modifyMagasin = async (id, updatedMarket) => {
  try {
      const token = getToken();


      const response = await axios.patch(`${API_URL}/market/${id}`, updatedMarket, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error modifying market:', error.response?.data || error.message);
      throw error;
  }
};

export const searchMagasins = async (searchTerm) => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/market/search/${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error during search:', error.response?.data || error.message);
    throw error;
  }
};

export const decreaseMarketTotals = async (id, period) => {
  try {
    const token = getToken();
    const response = await axios.patch(
      `${API_URL}/market/${id}/decrease/${period}`,
      null, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error decreasing market totals:', error);
    throw error;
  }
};

export const fetchMarketById = async (id) => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/market/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchAllMarkets = async () => {
  const token = getToken();
  const response = await axios.get(`${API_URL}/market/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};