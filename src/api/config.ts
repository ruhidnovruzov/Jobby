import axios from 'axios';

// const API_BASE_URL = 'http://10.2.23.15:9090/api';
const API_BASE_URL = 'http://localhost:5067/api';




const axiosInstance = axios.create({
  baseURL: API_BASE_URL,    
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Tokeni header-ə əlavə edir
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: 401 xətası alındıqda istifadəçini yönləndirir
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Login zamanı yanlış credential 401 qaytara bilər — bu halda refresh/yönləndirmə etmə
      const requestUrl: string | undefined = error?.config?.url;
      if (requestUrl && requestUrl.includes('/api/auth/login')) {
        return Promise.reject(error);
      }

      // Tokeni sil və istifadəçini /admin-login-ə yönləndir
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;