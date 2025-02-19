import { useState, useEffect } from 'react';
import api from '../services/api';

interface DashboardData {
  totalUsers: number;
  totalAccess: number;
  conversionRate: number;
  chartData: {
    labels: string[];
    values: number[];
  };
  recentUsers: {
    id: number;
    name: string;
    status: string;
    accessLevel: string;
  }[];
}

export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard');
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  return {
    data,
    loading,
    error,
    refreshData,
  };
};

export default useDashboardData; 