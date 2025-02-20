import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import UserCard from '../../../../pages/Users/components/UserCard';
import { theme } from '../../../../theme';

const mockUser = {
  id: 1,
  nome: 'João Silva',
  email: 'joao@exemplo.com',
  cargo: 'Administrador',
  status: 'Ativo',
  ultimoAcesso: '2024-02-19',
  avatar: 'https://exemplo.com/avatar.jpg',
};

const mockOnEdit = vi.fn();
const mockOnDelete = vi.fn();

const renderUserCard = (props = {}) => {
  return render(
    <ChakraProvider theme={theme}>
      <UserCard
        user={mockUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        {...props}
      />
    </ChakraProvider>
  );
};

describe('UserCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar as informações do usuário corretamente', () => {
      renderUserCard();
      
      expect(screen.getByText(mockUser.nome)).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
      expect(screen.getByText(mockUser.cargo)).toBeInTheDocument();
      expect(screen.getByText(mockUser.status)).toBeInTheDocument();
    });

    it('deve renderizar o avatar do usuário', () => {
      renderUserCard();
      
      const avatar = screen.getByAltText(`Avatar de ${mockUser.nome}`);
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', mockUser.avatar);
    });

    it('deve renderizar o badge de status com a cor correta', () => {
      renderUserCard();
      
      const statusBadge = screen.getByText(mockUser.status);
      expect(statusBadge).toHaveClass('bg-green-100', 'text-green-800');

      // Teste para status inativo
      renderUserCard({
        user: { ...mockUser, status: 'Inativo' }
      });
      
      const inativoBadge = screen.getByText('Inativo');
      expect(inativoBadge).toHaveClass('bg-red-100', 'text-red-800');
    });

    it('deve renderizar a data de último acesso formatada', () => {
      renderUserCard();
      
      expect(screen.getByText('Último acesso:')).toBeInTheDocument();
      expect(screen.getByText('19/02/2024')).toBeInTheDocument();
    });
  });

  describe('Interações', () => {
    it('deve chamar onEdit ao clicar no botão de editar', () => {
      renderUserCard();
      
      const editButton = screen.getByText('Editar');
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
    });

    it('deve chamar onDelete ao clicar no botão de remover', () => {
      renderUserCard();
      
      const deleteButton = screen.getByText('Remover');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockUser);
    });

    it('deve mostrar confirmação antes de deletar', () => {
      renderUserCard();
      
      const deleteButton = screen.getByText('Remover');
      fireEvent.click(deleteButton);

      expect(screen.getByText('Confirmar exclusão')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
      expect(screen.getByText('Confirmar')).toBeInTheDocument();

      // Cancelar não deve chamar onDelete
      fireEvent.click(screen.getByText('Cancelar'));
      expect(mockOnDelete).not.toHaveBeenCalled();

      // Confirmar deve chamar onDelete
      fireEvent.click(deleteButton);
      fireEvent.click(screen.getByText('Confirmar'));
      expect(mockOnDelete).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('Estados de Loading', () => {
    it('deve mostrar estado de loading durante a edição', () => {
      renderUserCard({ isEditing: true });
      
      expect(screen.getByText('Salvando...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('deve mostrar estado de loading durante a exclusão', () => {
      renderUserCard({ isDeleting: true });
      
      expect(screen.getByText('Excluindo...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Validações', () => {
    it('deve desabilitar botões durante operações', () => {
      renderUserCard({ isEditing: true });
      
      expect(screen.getByText('Editar')).toBeDisabled();
      expect(screen.getByText('Remover')).toBeDisabled();
    });

    it('deve mostrar mensagem de erro quando houver falha na operação', () => {
      renderUserCard({ error: 'Erro ao salvar usuário' });
      
      expect(screen.getByText('Erro ao salvar usuário')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels adequados para leitores de tela', () => {
      renderUserCard();
      
      expect(screen.getByLabelText('Editar usuário')).toBeInTheDocument();
      expect(screen.getByLabelText('Remover usuário')).toBeInTheDocument();
    });

    it('deve ter role e aria-labels corretos nos elementos interativos', () => {
      renderUserCard();
      
      const editButton = screen.getByRole('button', { name: 'Editar usuário' });
      const deleteButton = screen.getByRole('button', { name: 'Remover usuário' });

      expect(editButton).toHaveAttribute('aria-label', 'Editar usuário');
      expect(deleteButton).toHaveAttribute('aria-label', 'Remover usuário');
    });
  });
}); 