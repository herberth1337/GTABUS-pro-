import api from './api.js';

// Se agrega a la misma instancia de axios que usa toda la app:
//  - envía el token en cada petición
//  - si el servidor responde 401 (sesión vencida), avisa para cerrar la sesión
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gtabus_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const esLogin = error.config && error.config.url && error.config.url.includes('/auth/login');
    if (error.response && error.response.status === 401 && !esLogin) {
      window.dispatchEvent(new Event('gtabus:logout'));
    }
    return Promise.reject(error);
  }
);

export default api;
