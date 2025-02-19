import { useState, useEffect } from 'react';
import api from '../services/api';

interface AnalyticsData {
  visitsToday: number;
  averageTime: string;
  bounceRate: number;
  conversions: number;
  weeklyVisits: {
    labels: string[];
    values: number[];
  };
  monthlyConversion: {
    labels: string[];
    values: number[];
  };
  topPages: {
    page: string;
    visits: number;
  }[];
}

export const useAnalyticsData = (period: 'day' | 'week' | 'month' = 'day') => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics?period=${period}`);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados de analytics');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const refreshData = () => {
    fetchAnalyticsData();
  };

  return {
    data,
    loading,
    error,
    refreshData,
  };
};

export default useAnalyticsData; 