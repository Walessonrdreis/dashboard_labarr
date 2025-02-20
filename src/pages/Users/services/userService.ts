import api from '../../../services/api';
import { User, UserFilters, UserFormData, UsersResponse } from '../types/User';
import { API_ENDPOINTS } from '../constants/userConstants';
import { validateUser } from '../utils/userHelpers';

class UserService {
  async getUsers(filters?: UserFilters): Promise<UsersResponse> {
    try {
      const { data } = await api.get(API_ENDPOINTS.USERS, {
        params: filters
      });
      return data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async createUser(userData: UserFormData): Promise<User> {
    if (!validateUser(userData)) {
      throw new Error('Dados de usuário inválidos');
    }

    try {
      const { data } = await api.post(API_ENDPOINTS.USERS, userData);
      return data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async updateUser(user: User): Promise<User> {
    if (!user.id || !validateUser(user)) {
      throw new Error('Dados de usuário inválidos');
    }

    try {
      const { data } = await api.put(
        API_ENDPOINTS.USER_BY_ID(user.id),
        user
      );
      return data;
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    if (!userId || userId <= 0) {
      throw new Error('ID de usuário inválido');
    }

    try {
      await api.delete(API_ENDPOINTS.USER_BY_ID(userId));
    } catch (error: any) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): never {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    if (error.name === 'TimeoutError') {
      throw new Error('Tempo limite excedido. Tente novamente.');
    }

    if (error.message === 'Network Error') {
      throw new Error('Erro de conexão. Verifique sua internet.');
    }

    throw error;
  }
}

export const userService = new UserService(); 