import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useAuth } from '../../../../pages/Login/hooks/useAuth';
import { authService } from '../../../../pages/Login/services/authService';
import { ERROR_MESSAGES } from '../../../../pages/Login/utils/constants';

const mockNavigate = vi.fn();

// Mock do useNavigate
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

// Mock do authService
vi.mock('../../../../pages/Login/services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    validateToken: vi.fn()
  }
}));

describe('useAuth', () => {
  const mockCredentials = {
    email: 'teste@exemplo.com',
    password: 'senha123'
  };

  const mockUser = {
    id: 1,
    name: 'Teste',
    email: 'teste@exemplo.com'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Login', () => {
    it('deve realizar login com sucesso', async () => {
      (authService.login as jest.Mock).mockResolvedValue({ user: mockUser, token: 'token-123' });
      
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login(mockCredentials);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('deve lidar com erro de login', async () => {
      const errorResponse = {
        response: {
          data: {
            message: ERROR_MESSAGES.INVALID_CREDENTIALS
          }
        }
      };
      (authService.login as jest.Mock).mockRejectedValue(errorResponse);
      
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.login(mockCredentials);
      });

      expect(result.current.error).toBe(ERROR_MESSAGES.INVALID_CREDENTIALS);
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('deve atualizar estado de loading durante o login', async () => {
      let resolveLogin: (value: { user: typeof mockUser; token: string }) => void;
      const loginPromise = new Promise<{ user: typeof mockUser; token: string }>(resolve => {
        resolveLogin = resolve;
      });
      
      (authService.login as jest.Mock).mockReturnValue(loginPromise);
      
      const { result } = renderHook(() => useAuth());

      let promise: Promise<void>;
      act(() => {
        promise = result.current.login(mockCredentials);
      });
      
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveLogin!({ user: mockUser, token: 'token-123' });
        await promise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Logout', () => {
    it('deve realizar logout com sucesso', async () => {
      (authService.logout as jest.Mock).mockResolvedValue(undefined);
      
      const { result } = renderHook(() => useAuth());

      // Primeiro faz login para ter um usuário
      (authService.login as jest.Mock).mockResolvedValue({ user: mockUser });
      await act(async () => {
        await result.current.login(mockCredentials);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBeNull();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('deve lidar com erro no logout', async () => {
      const errorResponse = {
        response: {
          data: {
            message: ERROR_MESSAGES.SERVER_ERROR
          }
        }
      };
      (authService.logout as jest.Mock).mockRejectedValue(errorResponse);
      
      const { result } = renderHook(() => useAuth());

      // Primeiro faz login para ter um usuário
      (authService.login as jest.Mock).mockResolvedValue({ user: mockUser });
      await act(async () => {
        await result.current.login(mockCredentials);
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(result.current.error).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });
  });

  describe('Verificação de Token', () => {
    it('deve validar token com sucesso', async () => {
      (authService.validateToken as jest.Mock).mockResolvedValue(true);
      
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it('deve redirecionar para login quando token é inválido', async () => {
      (authService.validateToken as jest.Mock).mockResolvedValue(false);
      
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    it('deve lidar com erro na validação do token', async () => {
      const errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      (authService.validateToken as jest.Mock).mockRejectedValue(new Error(errorMessage));
      
      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.checkAuth();
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('Gerenciamento de Estado', () => {
    it('deve limpar erro ao chamar clearError', () => {
      const { result } = renderHook(() => useAuth());

      // Simula um erro
      act(() => {
        result.current.login(mockCredentials).catch(() => {});
      });

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });

    it('deve manter estado de autenticação consistente', async () => {
      const { result } = renderHook(() => useAuth());

      // Login com sucesso
      (authService.login as jest.Mock).mockResolvedValue({ user: mockUser });
      await act(async () => {
        await result.current.login(mockCredentials);
      });
      expect(result.current.isAuthenticated).toBe(true);

      // Logout com sucesso
      (authService.logout as jest.Mock).mockResolvedValue(undefined);
      await act(async () => {
        await result.current.logout();
      });
      expect(result.current.isAuthenticated).toBe(false);
    });
  });
}); 