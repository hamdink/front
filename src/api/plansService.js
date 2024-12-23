import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export async function fetchPlans(){
    try {
        const response = await axios.get(`${API_URL}/plans`);
        return response.data;
    } catch (error) {
        console.error('Error fetching plans', error);
        throw error;
    }

}
export async function deletePlan(id){
    try {
        await axios.delete(`${API_URL}/plans/${id}`);
    } catch (error) {
        console.error('Error deleting plan', error);
        throw error;
    }
}
export async function addPlan(plan){
    try {
        const response = await axios.post(`${API_URL}/plans`, plan);
        return response.data;
    } catch (error) {
        console.error('Error adding plan', error);
        throw error;
    }
}
export const modifyPlan = async (id, planData) => {
    try {
      console.log('Modifying plan:', id, planData); // Add this line
      const response = await axios.patch(`${API_URL}/plans/${id}`, planData);
      return response.data;
    } catch (error) {
      console.error('Error modifying plan:', error);
      throw error;
    }
  };

export async function fetchPlan(id){
    try {
        const response = await axios.get(`${API_URL}/plans/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching plan', error);
        throw error;
    }
}
export async function searchPlans(searchTerm){
    try {
        const response = await axios.get(`${API_URL}/plans/search/${searchTerm}`);
        return response.data;
    } catch (error) {
        console.error('Error searching plans', error);
        throw error;
    }
}
export const decreasePlanTotals = async (id, period) => {
    try {
        const response = await axios.patch(`${API_URL}/plans/${id}/decrease/${period}`);
        return response.data;
    } catch (error) {
        console.error('Error decreasing plan totals:', error);
        throw error;
    }
};