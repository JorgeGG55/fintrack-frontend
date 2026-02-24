import api from './api';

export const categoryService = {
  // Obtener todas las categorías
  getAll: async (type = null) => {
    const params = type ? `?type=${type}` : '';
    const response = await api.get(`/categories${params}`);
    return response.data;
  },
};