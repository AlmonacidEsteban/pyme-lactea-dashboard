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
      const response = await apiClient.get('/clientes/rubros/');
      setRubros(response);
    } catch (err) {
      setError('Error al cargar los rubros');
      console.error('Error fetching rubros:', err);
    } finally {
      setLoading(false);
    }
  };

  const createRubro = async (rubroData: { nombre: string; descripcion?: string }) => {
    try {
      const response = await apiClient.post('/clientes/rubros/', rubroData);
      setRubros(prev => [...prev, response]);
      return response;
    } catch (err) {
      console.error('Error creating rubro:', err);
      throw err;
    }
  };

  const updateRubro = async (id: number, rubroData: Partial<Rubro>) => {
    try {
      const response = await apiClient.patch(`/clientes/rubros/${id}/`, rubroData);
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
      await apiClient.delete(`/clientes/rubros/${id}/`);
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