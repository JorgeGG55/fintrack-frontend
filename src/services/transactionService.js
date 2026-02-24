import api from './api';

export const transactionService = {
  // Obtener todas las transacciones
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/transactions?${params}`);
    return response.data;
  },

  // Obtener una transacción
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  // Crear transacción
  create: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  // Actualizar transacción
  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  // Eliminar transacción
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Obtener estadísticas
  getStats: async (month, year) => {
    const params = month && year ? `?month=${month}&year=${year}` : '';
    const response = await api.get(`/transactions/stats/summary${params}`);
    return response.data;
  },

  // Buscar transacciones
  search: async (query) => {
    const response = await api.get(`/transactions/search?q=${query}`);
    return response.data;
  },
};