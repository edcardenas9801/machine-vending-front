import axios from 'axios';

const backendURL = process.env.REACT_APP_BACKEND_URL;
const axiosInstance = axios.create({
    baseURL: backendURL,
});
export default axiosInstance;