import axios from "axios";

const baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api/v1';

const instance = axios.create({
  baseURL: baseURL
});

export default instance;
