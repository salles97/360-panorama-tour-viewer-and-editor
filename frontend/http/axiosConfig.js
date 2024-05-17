import axios from 'axios';

// Defina a URL base aqui
const baseURL = 'http://localhost:3000/';

const axiosInstance = axios.create({
  baseURL: baseURL,
  // Você pode adicionar outras configurações padrão aqui
});

export default axiosInstance;
