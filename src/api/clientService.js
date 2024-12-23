import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchClients(page) {
    try {
        const response = await axios.get(`${API_URL}/client?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching clients', error);
        throw error;
    }
    }

export async function deleteClient(id) {
    try {
        await axios.delete(`${API_URL}/client/${id}`);
    } catch (error) {
        console.error('Error deleting client', error);
        throw error;
    }
}

export async function addClient(client) {
    try {
        const response = await axios.post(`${API_URL}/client`, client);
        return response.data;
    } catch (error) {
        console.error('Error adding client', error);
        throw error;
    }
}

export async function modifyClient(client) {
    try {
        const response = await axios.patch(`${API_URL}/client/${client._id}`, client);
        return response.data;
    } catch (error) {
        console.error('Error modifying client', error);
        throw error;
    }
}

export async function searchClients(searchTerm) {
    try {
        const response = await axios.get(`${API_URL}/client/search/${searchTerm}`);
        return response.data; 
    } catch (error) {
        console.error('Error searching clients', error);
        throw error;
    }
}
export async function fetchAllClients() {
    try {
        const response = await axios.get(`${API_URL}/client/all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching clients', error);
        throw error;
    }
}