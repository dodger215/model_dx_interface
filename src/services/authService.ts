import axios from 'axios';

export const API_URL = 'https://server-model-dx.onrender.com';

export const registerUser = async (data: FormData) => {
    
  return await axios.post(`${API_URL}/register`, data);
};

export const loginUser = async (data: FormData) => {
  return await axios.post(`${API_URL}/user/login`, data);
};
