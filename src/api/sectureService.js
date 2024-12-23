import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchSectures(page) {
    try {
        const response = await axios.get(`${API_URL}/secture?page=${page}`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching sectures', error);
        throw error;
    }
}

export async function deleteSecture(id) {
    try {
        await axios.delete(`${API_URL}/secture/${id}`);
    } catch (error) {
        console.error('Error deleting secure', error);
        throw error;
    }
}
export async function addSecture(secure) {
    try {
        const response = await axios.post(`${API_URL}/secture`, secure);
        return response.data;
    } catch (error) {
        console.error('Error adding secure', error);
        throw error;
    }
}
export async function modifySecture(secure) {
    try {
        const response = await axios.patch(`${API_URL}/secture/${secure._id}`, secure);
        return response.data;
    } catch (error) {
        console.error('Error modifying secure', error);
        throw error;
    }
}
export async function searchSectures(searchTerm) {
    try {
        const response = await axios.get(`${API_URL}/secture/search/${searchTerm}`);
        return response.data;
    } catch (error) {
        console.error('Error searching secures', error);
        throw error;
    }
}
export async function fetchallSectures() {
    try {
        const response = await axios.get(`${API_URL}/secture/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all secures', error);
        throw error;
    }
}