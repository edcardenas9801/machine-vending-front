import axios from 'axios';

const backendURL = 'http://127.0.0.1:8000';
const axiosInstance = axios.create({
    baseURL: backendURL,
});
export default axiosInstance;