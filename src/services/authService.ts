import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const registerUser = async (data: FormData) => {
    
  return await axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data: FormData) => {
  return await axios.post(`${API_URL}/user/login`, data);
};
