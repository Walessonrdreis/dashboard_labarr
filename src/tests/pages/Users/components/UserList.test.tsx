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
    status: 'active',
    ultimoAcesso: '2024-02-19',
  },
  {
    id: 2,
    nome: 'Maria Santos',
    email: 'maria@exemplo.com',
    cargo: 'Usuário',
    status: 'active',
    ultimoAcesso: '2024-02-18',
  },
  {
    id: 3,
    nome: 'Pedro Costa',
    email: 'pedro@exemplo.com',
    cargo: 'Usuário',
    status: 'inactive',
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
        currentPage={2}
        totalPages={3}
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
      
      const editButtons = screen.getAllByLabelText('Editar Usuário');
      const deleteButtons = screen.getAllByLabelText('Excluir Usuário');

      expect(editButtons).toHaveLength(mockUsers.length);
      expect(deleteButtons).toHaveLength(mockUsers.length);
    });
  });

  describe('Paginação', () => {
    it('deve renderizar os controles de paginação', () => {
      renderUserList();
      
      expect(screen.getByLabelText('Página anterior')).toBeInTheDocument();
      expect(screen.getByLabelText('Próxima página')).toBeInTheDocument();
      expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
    });

    it('deve chamar onPageChange ao clicar nos botões de paginação', () => {
      renderUserList({ totalPages: 3, currentPage: 2 });
      
      fireEvent.click(screen.getByLabelText('Próxima página'));
      expect(mockOnPageChange).toHaveBeenCalledWith(3);

      fireEvent.click(screen.getByLabelText('Página anterior'));
      expect(mockOnPageChange).toHaveBeenCalledWith(1);
    });

    it('deve desabilitar botão "Anterior" na primeira página', () => {
      renderUserList({ totalPages: 3, currentPage: 1 });
      
      expect(screen.getByLabelText('Página anterior')).toBeDisabled();
      expect(screen.getByLabelText('Próxima página')).not.toBeDisabled();
    });

    it('deve desabilitar botão "Próxima" na última página', () => {
      renderUserList({ totalPages: 3, currentPage: 3 });
      
      expect(screen.getByLabelText('Página anterior')).not.toBeDisabled();
      expect(screen.getByLabelText('Próxima página')).toBeDisabled();
    });
  });

  describe('Interações', () => {
    it('deve chamar onEdit ao clicar no botão de editar', () => {
      renderUserList();
      
      const editButtons = screen.getAllByLabelText('Editar Usuário');
      fireEvent.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledWith(mockUsers[0]);
    });

    it('deve chamar onDelete ao clicar no botão de remover', () => {
      renderUserList();
      
      const deleteButtons = screen.getAllByLabelText('Excluir Usuário');
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
      
      const nomeHeader = screen.getByRole('columnheader', { name: /nome/i });
      fireEvent.click(nomeHeader);

      const userNames = screen.getAllByTestId('user-name')
        .map(element => element.textContent);
      const sortedNames = ['João Silva', 'Maria Santos', 'Pedro Costa'];
      
      expect(userNames).toEqual(sortedNames);
    });

    it('deve alternar entre ordenação ascendente e descendente', () => {
      renderUserList();
      
      const nameHeader = screen.getByRole('columnheader', { name: /nome/i });
      
      // Primeira clicada - ordem ascendente
      fireEvent.click(nameHeader);
      let userNames = screen.getAllByTestId('user-name')
        .map(element => element.textContent);
      expect(userNames).toEqual(['João Silva', 'Maria Santos', 'Pedro Costa']);

      // Segunda clicada - ordem descendente
      fireEvent.click(nameHeader);
      userNames = screen.getAllByTestId('user-name')
        .map(element => element.textContent);
      expect(userNames).toEqual(['Pedro Costa', 'Maria Santos', 'João Silva']);
    });
  });
}); 