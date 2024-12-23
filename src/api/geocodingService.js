import axios from 'axios';

const CORS_PROXY = 'http://localhost:3001'; // The URL of your CORS proxy server

export const getCoordinates = async (address) => {
    try {
        const response = await axios.get(`${CORS_PROXY}/geocode`, {
            params: {
                address: address
            }
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Proxy response status:', response.status);
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw error;
    }
};
