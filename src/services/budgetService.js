import api from './api';

export const budgetService = {
  // Obtener todos los presupuestos
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/budgets?${params}`);
    return response.data;
  },

  // Crear presupuesto
  create: async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },

  // Actualizar presupuesto
  update: async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  },

  // Eliminar presupuesto
  delete: async (id) => {
    const response = await api.delete(`/budgets/${id}`);
    return response.data;
  },
};