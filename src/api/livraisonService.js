import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function addLivraison(livraison) {
    try {
        const response = await axios.post(`${API_URL}/livraison`, livraison);
        return response.data;
    } catch (error) {
        console.error('Error adding livraison:', error);
        throw error;
    }
}

export async function fetchLivraisons(page = 1) {
    try {
        const response = await axios.get(`${API_URL}/livraison?page=${page}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching livraisons:', error);
        throw error;
    }
}

export async function searchLivraisons(searchTerm) {
    try {
        const response = await axios.get(`${API_URL}/livraison/search/${searchTerm}`);
        return response.data;
    } catch (error) {
        console.error('Error searching livraisons:', error);
        throw error;
    }
}

export async function fetchbyCommande(NumeroCommande) {
    try {
        const response = await axios.get(`${API_URL}/livraison/${NumeroCommande}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching livraison by commande:', error);
        throw error;
    }
}

export async function modifyLivraison(livraison) {
    try {
        console.log('Modifying livraison with ID:', livraison.id); // Log the ID for debugging
        const response = await axios.patch(`${API_URL}/livraison/${livraison.id}`, livraison);
        return response.data;
    } catch (error) {
        console.error('Error modifying livraison:', error);
        throw error;
    }
}

export const modifyDriver = async ({ id, driver, distance }) => {
    try {
        console.log('Modifying driver for livraison with ID:', id); // Log the ID for debugging
        const response = await axios.patch(`${API_URL}/livraison/${id}/driver`, { driver, distance });
        return response.data;
    } catch (error) {
        console.error('Error modifying driver:', error);
        throw error;
    }
};


export async function deleteLivraison(id) {
    try {
        console.log('Deleting livraison with ID:', id); 
        const response = await axios.delete(`${API_URL}/livraison/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting livraison:', error);
        throw error;
    }
}

export const updateStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/livraison/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Error updating status:', error);
        throw error;
    }
};

export async function pendingCount() {
    try {
        const response = await axios.get(`${API_URL}/livraison/pending/count`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending count:', error);
        throw error;
    }
}

export async function findByStatus(status) {
    try {
        const response = await axios.get(`${API_URL}/livraison/byStatus/${status}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching livraisons by status:', error);
        throw error;
    }
}
export async function fetchbyReference(reference) {
    try {
        console.log(`Making API call with reference: ${reference}`);
        const response = await axios.get(`${API_URL}/livraison/reference/${reference}`);
        console.log('API response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching livraison by reference:', error);
        throw error;
    }

}
export const fetchByDriverAndDate = async (driverId, date) => {
    try {
        const response = await axios.get(`${API_URL}/livraison/driver/${driverId}`, {
            params: { date },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching deliveries by driver and date:', error);
        throw error;
    }
};

export async function fetchByMarketId(marketId, page = 1, searchTerm = '') {
    try {
        const response = await axios.get(`${API_URL}/livraison/market/${marketId}`, {
            params: {
                page,
                searchTerm,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching livraisons by market ID:', error);
        throw error;
    }
}
