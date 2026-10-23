import api from './authSetup.js';

export const AccesosService = {
  estacion: (id) => api.get(`/estaciones/${id}`),
  accesos: (id) => api.get(`/estaciones/${id}/accesos`),
  crearAcceso: (id, data) => api.post(`/estaciones/${id}/accesos`, data),
  agregarGuardia: (id, idAcceso, data) =>
    api.post(`/estaciones/${id}/accesos/${idAcceso}/guardias`, data),
};
