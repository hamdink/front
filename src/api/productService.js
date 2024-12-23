import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchProducts(page, limit = 6) {
  try {
    const response = await axios.get(`${API_URL}/product?page=${page}&limit=${limit}`);
    return response.data; // { products, total, totalPages }
  } catch (error) {
    console.error('Error fetching products', error);
    throw error;
  }
}

export async function fetchProductsNoPage(){
  try {
    const response = await axios.get(`${API_URL}/product/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    await axios.delete(`${API_URL}/product/${id}`);
  } catch (error) {
    console.error('Error deleting product', error);
    throw error;
  }
}

export async function addProduct(product) {
  try {
    const response = await axios.post(`${API_URL}/product`, product);
    return response.data;
  } catch (error) {
    console.error('Error adding product', error);
    throw error;
  }
}

export async function modifyProduct(product) {
  try {
    const response = await axios.patch(`${API_URL}/product/${product._id}`, product);
    return response.data;
  } catch (error) {
    console.error('Error modifying product', error);
    throw error;
  }
}

export async function searchProducts(searchTerm) {
  try {
    const response = await axios.get(`${API_URL}/product/search/${searchTerm}`);
    return response.data;
  } catch (error) {
    console.error('Error searching products', error);
    throw error;
  }
}
