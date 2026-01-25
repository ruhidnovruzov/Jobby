import axios from 'axios';

// const API_BASE_URL = 'http://10.2.23.15:9090/api';
const API_BASE_URL = 'http://188.132.237.113:5067/api';



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
      // axios config.url may be '/auth/login' or '/api/auth/login' depending on how the request was made.
      // If this error originates from a login request, don't perform a redirect here — let the caller handle the error
      if (requestUrl && (requestUrl.includes('/auth/login') || requestUrl.includes('/api/auth/login'))) {
        return Promise.reject(error);
      }

      // Do not redirect for public applicant endpoints (these may be used by anonymous applicants)
      if (requestUrl && requestUrl.includes('/applicants')) {
        return Promise.reject(error);
      }

  // Tokeni sil və istifadəçini admin-login səhifəsinə yönləndir
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Router basename is '/vacancy/', ensure redirect includes that base so the client route resolves correctly
  window.location.href = '/vacancy/admin-login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;