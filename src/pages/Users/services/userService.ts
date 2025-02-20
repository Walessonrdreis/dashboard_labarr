import api from '../../../services/api';
import { User, UserFilters, UserFormData, UsersResponse } from '../types/User';
import { API_ENDPOINTS } from '../constants/userConstants';
import { validateUser } from '../utils/userHelpers';

export class UserService {
  private handleError(error: any): never {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Timeout');
    }
    if (error.message === 'Network Error') {
      throw new Error('Network Error');
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }

  async getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
    try {
      const response = await api.get<GetUsersResponse>('/users', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async createUser(userData: UserFormData): Promise<User> {
    try {
      if (!validateUser(userData)) {
        throw new Error('Dados de usuário inválidos');
      }
      const response = await api.post<User>('/users', userData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateUser(user: User): Promise<User> {
    try {
      if (!user.id || !validateUser(user)) {
        throw new Error('Dados de usuário inválidos');
      }
      const response = await api.put<User>(`/users/${user.id}`, user);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      throw this.handleError(error);
    }
  }
}

export const userService = new UserService(); 