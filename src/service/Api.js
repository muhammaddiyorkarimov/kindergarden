import axios from "axios";

const baseURL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:8000/api/v1';

const instance = axios.create({
  baseURL: baseURL
});

export default instance;
