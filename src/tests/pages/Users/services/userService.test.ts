import { vi } from 'vitest';
import { userService } from '../../../../pages/Users/services/userService';
import api from '../../../../services/api';

// Mock do axios
vi.mock('../../../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('userService', () => {
  const mockUsers = [
    {
      id: 1,
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cargo: 'Administrador',
      status: 'Ativo',
      ultimoAcesso: '2024-02-19',
    },
    {
      id: 2,
      nome: 'Maria Santos',
      email: 'maria@exemplo.com',
      cargo: 'Usuário',
      status: 'Ativo',
      ultimoAcesso: '2024-02-18',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUsers', () => {
    it('deve buscar usuários com sucesso', async () => {
      const mockResponse = {
        data: {
          users: mockUsers,
          total: 2,
          totalPages: 1
        }
      };

      (api.get as jest.Mock).mockResolvedValue(mockResponse);

      const result = await userService.getUsers();

      expect(api.get).toHaveBeenCalledWith('/users', expect.any(Object));
      expect(result).toEqual(mockResponse.data);
    });

    it('deve aplicar parâmetros de busca e paginação', async () => {
      const params = {
        page: 2,
        limit: 10,
        search: 'João',
        status: 'Ativo'
      };

      await userService.getUsers(params);

      expect(api.get).toHaveBeenCalledWith('/users', {
        params: {
          page: 2,
          limit: 10,
          search: 'João',
          status: 'Ativo'
        }
      });
    });

    it('deve lidar com erro na busca', async () => {
      const error = new Error('Erro na API');
      (api.get as jest.Mock).mockRejectedValue(error);

      await expect(userService.getUsers()).rejects.toThrow('Erro na API');
    });
  });

  describe('createUser', () => {
    const newUser = {
      nome: 'Novo Usuário',
      email: 'novo@exemplo.com',
      cargo: 'Usuário',
      status: 'Ativo'
    };

    it('deve criar usuário com sucesso', async () => {
      const mockResponse = {
        data: { ...newUser, id: 3 }
      };

      (api.post as jest.Mock).mockResolvedValue(mockResponse);

      const result = await userService.createUser(newUser);

      expect(api.post).toHaveBeenCalledWith('/users', newUser);
      expect(result).toEqual(mockResponse.data);
    });

    it('deve validar dados obrigatórios', async () => {
      const invalidUser = {
        nome: 'Usuário Inválido'
      };

      await expect(userService.createUser(invalidUser as any)).rejects.toThrow();
    });

    it('deve lidar com erro na criação', async () => {
      const error = new Error('Erro ao criar usuário');
      (api.post as jest.Mock).mockRejectedValue(error);

      await expect(userService.createUser(newUser)).rejects.toThrow('Erro ao criar usuário');
    });
  });

  describe('updateUser', () => {
    const updatedUser = {
      id: 1,
      nome: 'João Silva Atualizado',
      email: 'joao@exemplo.com',
      cargo: 'Administrador',
      status: 'Ativo'
    };

    it('deve atualizar usuário com sucesso', async () => {
      const mockResponse = {
        data: updatedUser
      };

      (api.put as jest.Mock).mockResolvedValue(mockResponse);

      const result = await userService.updateUser(updatedUser);

      expect(api.put).toHaveBeenCalledWith(`/users/${updatedUser.id}`, updatedUser);
      expect(result).toEqual(mockResponse.data);
    });

    it('deve validar ID do usuário', async () => {
      const userWithoutId = { ...updatedUser };
      delete userWithoutId.id;

      await expect(userService.updateUser(userWithoutId as any)).rejects.toThrow();
    });

    it('deve lidar com erro na atualização', async () => {
      const error = new Error('Erro ao atualizar usuário');
      (api.put as jest.Mock).mockRejectedValue(error);

      await expect(userService.updateUser(updatedUser)).rejects.toThrow('Erro ao atualizar usuário');
    });
  });

  describe('deleteUser', () => {
    it('deve deletar usuário com sucesso', async () => {
      (api.delete as jest.Mock).mockResolvedValue({});

      await userService.deleteUser(1);

      expect(api.delete).toHaveBeenCalledWith('/users/1');
    });

    it('deve validar ID do usuário', async () => {
      await expect(userService.deleteUser(0)).rejects.toThrow();
      await expect(userService.deleteUser(-1)).rejects.toThrow();
    });

    it('deve lidar com erro na deleção', async () => {
      const error = new Error('Erro ao deletar usuário');
      (api.delete as jest.Mock).mockRejectedValue(error);

      await expect(userService.deleteUser(1)).rejects.toThrow('Erro ao deletar usuário');
    });
  });

  describe('Validações', () => {
    it('deve validar formato de email', async () => {
      const userWithInvalidEmail = {
        nome: 'Teste',
        email: 'email-invalido',
        cargo: 'Usuário',
        status: 'Ativo'
      };

      await expect(userService.createUser(userWithInvalidEmail)).rejects.toThrow();
    });

    it('deve validar status permitidos', async () => {
      const userWithInvalidStatus = {
        nome: 'Teste',
        email: 'teste@exemplo.com',
        cargo: 'Usuário',
        status: 'Status Inválido'
      };

      await expect(userService.createUser(userWithInvalidStatus)).rejects.toThrow();
    });

    it('deve validar cargos permitidos', async () => {
      const userWithInvalidRole = {
        nome: 'Teste',
        email: 'teste@exemplo.com',
        cargo: 'Cargo Inválido',
        status: 'Ativo'
      };

      await expect(userService.createUser(userWithInvalidRole)).rejects.toThrow();
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve lidar com timeout da API', async () => {
      const timeoutError = { code: 'ECONNABORTED' };
      (api.get as jest.Mock).mockRejectedValue(timeoutError);

      await expect(userService.getUsers()).rejects.toThrow('Timeout');
    });

    it('deve lidar com erro de rede', async () => {
      const networkError = { message: 'Network Error' };
      (api.get as jest.Mock).mockRejectedValue(networkError);

      await expect(userService.getUsers()).rejects.toThrow('Network Error');
    });

    it('deve lidar com erro específico da API', async () => {
      const apiError = {
        response: {
          data: {
            message: 'Erro específico da API'
          }
        }
      };
      (api.get as jest.Mock).mockRejectedValue(apiError);

      await expect(userService.getUsers()).rejects.toThrow('Erro específico da API');
    });
  });
}); 