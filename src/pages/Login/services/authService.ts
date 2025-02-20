import api from '../utils/api';
import { LoginCredentials, LoginResponse } from '../types/Auth';
import { setAuthToken, setUserData, clearAuthData } from '../utils/storage';
import { ERROR_MESSAGES } from '../utils/constants';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      const { token, user } = response.data;
      
      setAuthToken(token);
      setUserData(user);
      
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      clearAuthData();
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      await api.get('/auth/validate');
      return true;
    } catch (error) {
      clearAuthData();
      return false;
    }
  }
}; 