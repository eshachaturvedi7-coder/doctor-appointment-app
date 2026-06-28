import axios from 'axios';

// Yeh humare React ko backend (Node.js) se jodta hai
const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
});

// Yeh automatic aapka login token har request mein bhej dega
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;