import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginCredentials, User } from '../types/Auth';
import { authService } from '../services/authService';
import { getAuthToken, getUserData, setAuthToken, setUserData, removeAuthToken, removeUserData } from '../utils/storage';
import { formatErrorMessage } from '../utils/helpers';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(getUserData());
  const [isAuthenticated, setIsAuthenticated] = useState(!!getAuthToken());

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      setAuthToken(response.token);
      setUserData(response.user);
      setUser(response.user);
      setIsAuthenticated(true);
      navigate('/');
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      removeAuthToken();
      removeUserData();
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      removeAuthToken();
      removeUserData();
      navigate('/login');
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const isValid = await authService.validateToken();
      
      if (!isValid) {
        setUser(null);
        setIsAuthenticated(false);
        removeAuthToken();
        removeUserData();
        navigate('/login');
      } else {
        setIsAuthenticated(true);
      }
    } catch (err) {
      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      removeAuthToken();
      removeUserData();
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