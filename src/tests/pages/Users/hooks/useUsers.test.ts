import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useUsers } from '../../../../pages/Users/hooks/useUsers';
import { userService } from '../../../../pages/Users/services/userService';

// Mock do userService
vi.mock('../../../../pages/Users/services/userService', () => ({
  userService: {
    getUsers: vi.fn(),
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
  }
}));

describe('useUsers', () => {
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

  describe('Carregamento de Usuários', () => {
    it('deve carregar usuários com sucesso', async () => {
      (userService.getUsers as jest.Mock).mockResolvedValue({
        users: mockUsers,
        total: 2,
        totalPages: 1
      });

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.fetchUsers();
      });

      expect(result.current.users).toEqual(mockUsers);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('deve lidar com erro ao carregar usuários', async () => {
      const error = new Error('Falha ao carregar usuários');
      (userService.getUsers as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.fetchUsers();
      });

      expect(result.current.error).toBe('Falha ao carregar usuários');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.users).toEqual([]);
    });
  });

  describe('Paginação', () => {
    it('deve atualizar página corretamente', async () => {
      (userService.getUsers as jest.Mock).mockResolvedValue({
        users: mockUsers,
        total: 10,
        totalPages: 3
      });

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        result.current.setPage(2);
      });

      expect(userService.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
      expect(result.current.currentPage).toBe(2);
    });

    it('deve manter estado de paginação durante o carregamento', async () => {
      const { result } = renderHook(() => useUsers());

      await act(async () => {
        result.current.setPage(2);
      });

      expect(result.current.currentPage).toBe(2);
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('Filtros e Busca', () => {
    it('deve aplicar filtro de busca', async () => {
      const { result } = renderHook(() => useUsers());

      await act(async () => {
        result.current.setSearchTerm('João');
      });

      expect(userService.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'João' })
      );
    });

    it('deve aplicar filtro de status', async () => {
      const { result } = renderHook(() => useUsers());

      await act(async () => {
        result.current.setStatusFilter('Ativo');
      });

      expect(userService.getUsers).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'Ativo' })
      );
    });

    it('deve resetar paginação ao aplicar filtros', async () => {
      const { result } = renderHook(() => useUsers());

      await act(async () => {
        result.current.setPage(2);
        result.current.setSearchTerm('João');
      });

      expect(result.current.currentPage).toBe(1);
    });
  });

  describe('Operações CRUD', () => {
    const newUser = {
      nome: 'Novo Usuário',
      email: 'novo@exemplo.com',
      cargo: 'Usuário',
      status: 'Ativo'
    };

    it('deve criar usuário com sucesso', async () => {
      (userService.createUser as jest.Mock).mockResolvedValue({
        ...newUser,
        id: 3
      });

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.createUser(newUser);
      });

      expect(userService.createUser).toHaveBeenCalledWith(newUser);
      expect(result.current.error).toBeNull();
    });

    it('deve atualizar usuário com sucesso', async () => {
      const updatedUser = { ...mockUsers[0], nome: 'João Silva Atualizado' };
      (userService.updateUser as jest.Mock).mockResolvedValue(updatedUser);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.updateUser(updatedUser);
      });

      expect(userService.updateUser).toHaveBeenCalledWith(updatedUser);
      expect(result.current.error).toBeNull();
    });

    it('deve deletar usuário com sucesso', async () => {
      (userService.deleteUser as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.deleteUser(1);
      });

      expect(userService.deleteUser).toHaveBeenCalledWith(1);
      expect(result.current.error).toBeNull();
    });

    it('deve lidar com erro nas operações CRUD', async () => {
      const error = new Error('Falha na operação');
      (userService.createUser as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useUsers());

      await act(async () => {
        await result.current.createUser(newUser);
      });

      expect(result.current.error).toBe('Falha na operação');
    });
  });

  describe('Estado de Loading', () => {
    it('deve gerenciar estado de loading durante operações', async () => {
      const { result } = renderHook(() => useUsers());

      expect(result.current.isLoading).toBe(true); // Estado inicial

      (userService.getUsers as jest.Mock).mockResolvedValue({
        users: mockUsers,
        total: 2,
        totalPages: 1
      });

      await act(async () => {
        await result.current.fetchUsers();
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('deve manter loading durante operações concorrentes', async () => {
      const { result } = renderHook(() => useUsers());

      let resolveFirst: Function;
      let resolveSecond: Function;

      const firstPromise = new Promise(resolve => { resolveFirst = resolve; });
      const secondPromise = new Promise(resolve => { resolveSecond = resolve; });

      (userService.getUsers as jest.Mock)
        .mockImplementationOnce(() => firstPromise)
        .mockImplementationOnce(() => secondPromise);

      // Inicia duas operações concorrentes
      act(() => {
        result.current.fetchUsers();
        result.current.setPage(2);
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolveFirst!({ users: [], total: 0, totalPages: 1 });
        await firstPromise;
      });

      expect(result.current.isLoading).toBe(true); // Ainda carregando

      await act(async () => {
        resolveSecond!({ users: [], total: 0, totalPages: 1 });
        await secondPromise;
      });

      expect(result.current.isLoading).toBe(false); // Finalizado
    });
  });
}); 