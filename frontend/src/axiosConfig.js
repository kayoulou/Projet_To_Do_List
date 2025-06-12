import axios from 'axios';
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
 
// En prod, VITE_API_URL n’est pas défini donc baseURL = '' → appels relatifs
console.log("API URL (prod) =", baseURL);
const instance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});
export default instance;
