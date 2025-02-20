import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import UserList from '../../../../pages/Users/components/UserList';
import { theme } from '../../../../theme';

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
  {
    id: 3,
    nome: 'Pedro Costa',
    email: 'pedro@exemplo.com',
    cargo: 'Usuário',
    status: 'Inativo',
    ultimoAcesso: '2024-02-15',
  },
];

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();
const mockOnPageChange = vi.fn();

const renderUserList = (props = {}) => {
  return render(
    <ChakraProvider theme={theme}>
      <UserList
        users={mockUsers}
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        {...props}
      />
    </ChakraProvider>
  );
};

describe('UserList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar a lista de usuários corretamente', () => {
      renderUserList();
      
      mockUsers.forEach(user => {
        expect(screen.getByText(user.nome)).toBeInTheDocument();
        expect(screen.getByText(user.email)).toBeInTheDocument();
        expect(screen.getByText(user.cargo)).toBeInTheDocument();
      });
    });

    it('deve renderizar os badges de status corretamente', () => {
      renderUserList();
      
      const ativoBadges = screen.getAllByText('Ativo');
      const inativoBadge = screen.getByText('Inativo');

      expect(ativoBadges).toHaveLength(2);
      expect(inativoBadge).toBeInTheDocument();
    });

    it('deve renderizar os botões de ação para cada usuário', () => {
      renderUserList();
      
      const editButtons = screen.getAllByText('Editar');
      const deleteButtons = screen.getAllByText('Remover');

      expect(editButtons).toHaveLength(mockUsers.length);
      expect(deleteButtons).toHaveLength(mockUsers.length);
    });
  });

  describe('Paginação', () => {
    it('deve renderizar os controles de paginação', () => {
      renderUserList({ totalPages: 3, currentPage: 2 });
      
      expect(screen.getByText('Anterior')).toBeInTheDocument();
      expect(screen.getByText('Próxima')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('deve chamar onPageChange ao clicar nos botões de paginação', () => {
      renderUserList({ totalPages: 3, currentPage: 2 });
      
      fireEvent.click(screen.getByText('Próxima'));
      expect(mockOnPageChange).toHaveBeenCalledWith(3);

      fireEvent.click(screen.getByText('Anterior'));
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('deve desabilitar botão "Anterior" na primeira página', () => {
      renderUserList({ totalPages: 3, currentPage: 1 });
      
      expect(screen.getByText('Anterior')).toBeDisabled();
      expect(screen.getByText('Próxima')).not.toBeDisabled();
    });

    it('deve desabilitar botão "Próxima" na última página', () => {
      renderUserList({ totalPages: 3, currentPage: 3 });
      
      expect(screen.getByText('Anterior')).not.toBeDisabled();
      expect(screen.getByText('Próxima')).toBeDisabled();
    });
  });

  describe('Interações', () => {
    it('deve chamar onEdit ao clicar no botão de editar', () => {
      renderUserList();
      
      const editButtons = screen.getAllByText('Editar');
      fireEvent.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('deve chamar onDelete ao clicar no botão de remover', () => {
      renderUserList();
      
      const deleteButtons = screen.getAllByText('Remover');
      fireEvent.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledWith(mockUsers[0]);
    });
  });

  describe('Estados Vazios e de Erro', () => {
    it('deve mostrar mensagem quando não houver usuários', () => {
      renderUserList({ users: [] });
      
      expect(screen.getByText('Nenhum usuário encontrado')).toBeInTheDocument();
    });

    it('deve ocultar paginação quando houver apenas uma página', () => {
      renderUserList({ totalPages: 1 });
      
      expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
      expect(screen.queryByText('Próxima')).not.toBeInTheDocument();
    });
  });

  describe('Ordenação', () => {
    it('deve ordenar usuários por nome quando clicar no cabeçalho da coluna', () => {
      renderUserList();
      
      const nomeHeader = screen.getByText('Nome');
      fireEvent.click(nomeHeader);

      // Verifica se os usuários estão ordenados alfabeticamente
      const userNames = screen.getAllByTestId('user-name')
        .map(element => element.textContent);
      const sortedNames = [...userNames].sort();
      
      expect(userNames).toEqual(sortedNames);
    });

    it('deve alternar entre ordenação ascendente e descendente', () => {
      renderUserList();
      
      const nomeHeader = screen.getByText('Nome');
      
      // Primeiro clique - ordem ascendente
      fireEvent.click(nomeHeader);
      let userNames = screen.getAllByTestId('user-name')
        .map(element => element.textContent);
      let sortedNames = [...userNames].sort();
      expect(userNames).toEqual(sortedNames);

      // Segundo clique - ordem descendente
      fireEvent.click(nomeHeader);
      userNames = screen.getAllByTestId('user-name')
        .map(element => element.textContent);
      sortedNames = [...userNames].sort().reverse();
      expect(userNames).toEqual(sortedNames);
    });
  });
}); 