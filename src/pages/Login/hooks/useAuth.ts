import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, User } from '../types/Auth';
import { authService } from '../services/authService';
import { getAuthToken, getUserData } from '../utils/storage';
import { formatErrorMessage } from '../utils/helpers';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(getUserData());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await authService.login(credentials);
      
      setUser(response.user);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      setError(formatErrorMessage(err));
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.logout();
      
      setUser(null);
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const isValid = await authService.validateToken();
      
      if (!isValid) {
        setUser(null);
        setIsAuthenticated(false);
        navigate('/login');
      }
    } catch (err) {
      setError(formatErrorMessage(err));
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    clearError,
  };
}; 