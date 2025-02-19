import { useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastAccess: string;
}

interface UserData {
  users: User[];
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

export const useUserData = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados dos usuários');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const createUser = async (userData: Omit<User, 'id'>) => {
    try {
      const response = await api.post('/users', userData);
      await fetchUsers();
      return response.data;
    } catch (err) {
      throw new Error('Erro ao criar usuário');
    }
  };

  const updateUser = async (id: number, userData: Partial<User>) => {
    try {
      const response = await api.put(`/users/${id}`, userData);
      await fetchUsers();
      return response.data;
    } catch (err) {
      throw new Error('Erro ao atualizar usuário');
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      await fetchUsers();
    } catch (err) {
      throw new Error('Erro ao deletar usuário');
    }
  };

  return {
    data,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshData: fetchUsers,
  };
};

export default useUserData; 