import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
});

export const LineaService = {
  listar: () => api.get('/lineas'),
  crear: (data) => api.post('/lineas', data),
  estaciones: (id) => api.get(`/lineas/${id}/estaciones`),
  accesos: (id) => api.get(`/lineas/${id}/accesos`),
  buses: (id) => api.get(`/lineas/${id}/buses`),
  agregarEstacion: (id, data) => api.post(`/lineas/${id}/estaciones`, data)
};

export const EstacionService = {
  listar: () => api.get('/estaciones'),
  crear: (data) => api.post('/estaciones', data),
  accesos: (id) => api.get(`/estaciones/${id}/accesos`),
  distancia: (id, id2) => api.get(`/estaciones/${id}/distancia/${id2}`)
};

export const BusService = {
  listar: () => api.get('/buses'),
  crear: (data) => api.post('/buses', data),
  cambiarParqueo: (id, data) => api.put(`/buses/${id}/parqueo`, data),
  historialParqueo: (id) => api.get(`/buses/${id}/historial-parqueo`)
};

export const PilotoService = {
  listar: () => api.get('/pilotos'),
  obtener: (id) => api.get(`/pilotos/${id}`),
  crear: (data) => api.post('/pilotos', data),
  guardarResidencia: (id, data) => api.put(`/pilotos/${id}/residencia`, data),
  agregarComunicacion: (id, data) => api.post(`/pilotos/${id}/comunicacion`, data),
  agregarHistorialEducativo: (id, data) => api.post(`/pilotos/${id}/historial-educativo`, data)
};

export const ViajeService = {
  listar: () => api.get('/viajes'),
  crear: (data) => api.post('/viajes', data),
  visitas: (id) => api.get(`/viajes/${id}/visitas`),
  registrarVisita: (data) => api.post('/viajes/visitas', data)
};

export const MunicipalidadService = {
  listar: () => api.get('/municipalidades')
};

export const ParqueoService = {
  listar: () => api.get('/parqueos'),
  crear: (data) => api.post('/parqueos', data)
};

export default api;
