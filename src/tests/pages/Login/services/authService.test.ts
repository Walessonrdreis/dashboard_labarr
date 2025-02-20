import { vi } from 'vitest';
import { authService } from '../../../../pages/Login/services/authService';
import api from '../../../../pages/Login/utils/api';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '../../../../pages/Login/utils/constants';

// Mock do axios
vi.mock('../../../../pages/Login/utils/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn()
  }
}));

describe('authService', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };

  const mockToken = 'mock-jwt-token';
  const mockCredentials = {
    email: 'test@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('deve realizar login com sucesso e armazenar dados', async () => {
      const mockResponse = { data: { user: mockUser, token: mockToken } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const response = await authService.login(mockCredentials);

      expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
      expect(response).toEqual(mockResponse.data);
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(mockToken);
      expect(localStorage.getItem(USER_DATA_KEY)).toBe(JSON.stringify(mockUser));
    });

    it('deve propagar erro em caso de falha no login', async () => {
      const mockError = new Error('Falha na autenticação');
      (api.post as jest.Mock).mockRejectedValue(mockError);

      await expect(authService.login(mockCredentials)).rejects.toThrow(mockError);
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_DATA_KEY)).toBeNull();
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));
    });

    it('deve realizar logout com sucesso e limpar dados', async () => {
      (api.post as jest.Mock).mockResolvedValue({});

      await authService.logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_DATA_KEY)).toBeNull();
    });

    it('deve limpar dados mesmo em caso de erro no logout', async () => {
      const mockError = new Error('Erro no servidor');
      (api.post as jest.Mock).mockRejectedValue(mockError);

      await authService.logout();

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_DATA_KEY)).toBeNull();
    });
  });

  describe('validateToken', () => {
    it('deve retornar true para token válido', async () => {
      (api.get as jest.Mock).mockResolvedValue({});

      const isValid = await authService.validateToken();

      expect(api.get).toHaveBeenCalledWith('/auth/validate');
      expect(isValid).toBe(true);
    });

    it('deve retornar false e limpar dados para token inválido', async () => {
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));
      
      (api.get as jest.Mock).mockRejectedValue(new Error('Token inválido'));

      const isValid = await authService.validateToken();

      expect(isValid).toBe(false);
      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_DATA_KEY)).toBeNull();
    });
  });

  describe('Integração com localStorage', () => {
    it('deve armazenar e recuperar dados corretamente', async () => {
      const mockResponse = { data: { user: mockUser, token: mockToken } };
      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      await authService.login(mockCredentials);

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBe(mockToken);
      expect(JSON.parse(localStorage.getItem(USER_DATA_KEY)!)).toEqual(mockUser);
    });

    it('deve limpar dados completamente após logout', async () => {
      localStorage.setItem(AUTH_TOKEN_KEY, mockToken);
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(mockUser));

      await authService.logout();

      expect(localStorage.getItem(AUTH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(USER_DATA_KEY)).toBeNull();
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erro de rede', async () => {
      const networkError = new Error('Network Error');
      (api.post as jest.Mock).mockRejectedValue(networkError);

      await expect(authService.login(mockCredentials)).rejects.toThrow(networkError);
    });

    it('deve tratar erro de servidor', async () => {
      const serverError = { 
        response: { 
          data: { message: 'Internal Server Error' } 
        } 
      };
      (api.post as jest.Mock).mockRejectedValue(serverError);

      await expect(authService.login(mockCredentials)).rejects.toEqual(serverError);
    });

    it('deve tratar erro de validação de token', async () => {
      const validationError = new Error('Token Validation Error');
      (api.get as jest.Mock).mockRejectedValue(validationError);

      const isValid = await authService.validateToken();
      
      expect(isValid).toBe(false);
    });
  });
});