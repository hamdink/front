import axios from 'axios';
const API_URL=process.env.REACT_APP_API_URL;
export async function fetchUsers(page=1){
    const token=localStorage.getItem('token');
    try {
      const response=await axios.get(`${API_URL}/users?page=${page}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(response.data); 
      return response.data;
    }catch(error){
      console.error('Error fetching users', error);
      throw error;
    }
  }
  
  export async function searchUsers(searchTerm) {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { term: searchTerm },  // Correct query parameter
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users', error);
      throw error;
    }
  }