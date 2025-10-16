import { useState, useEffect } from 'react';
import { Rubro } from '@/types/clientes';
import { ApiClient } from '@/lib/api';

export const useRubros = () => {
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiClient = new ApiClient();

  const fetchRubros = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/rubros/');
      // Manejar respuesta paginada de Django REST Framework
      const rubrosData = response.results || response;
      setRubros(Array.isArray(rubrosData) ? rubrosData : []);
    } catch (err) {
      setError('Error al cargar los rubros');
      console.error('Error fetching rubros:', err);
      setRubros([]); // Asegurar que rubros sea siempre un array
    } finally {
      setLoading(false);
    }
  };

  const createRubro = async (rubroData: { nombre: string; descripcion?: string }) => {
    try {
      const response = await apiClient.post('/rubros/', rubroData);
      setRubros(prev => [...prev, response]);
      return response;
    } catch (err) {
      console.error('Error creating rubro:', err);
      throw err;
    }
  };

  const updateRubro = async (id: number, rubroData: Partial<Rubro>) => {
    try {
      const response = await apiClient.patch(`/rubros/${id}/`, rubroData);
      setRubros(prev => prev.map(rubro => 
        rubro.id === id ? response : rubro
      ));
      return response;
    } catch (err) {
      console.error('Error updating rubro:', err);
      throw err;
    }
  };

  const deleteRubro = async (id: number) => {
    try {
      await apiClient.delete(`/rubros/${id}/`);
      setRubros(prev => prev.filter(rubro => rubro.id !== id));
    } catch (err) {
      console.error('Error deleting rubro:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchRubros();
  }, []);

  return {
    rubros,
    loading,
    error,
    fetchRubros,
    createRubro,
    updateRubro,
    deleteRubro,
  };
};