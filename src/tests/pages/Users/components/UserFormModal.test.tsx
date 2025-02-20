import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';
import UserFormModal from '../../../../pages/Users/components/UserFormModal';
import { User } from '../../../../pages/Users/types/User';
import { LABELS, ERROR_MESSAGES } from '../../../../pages/Users/constants/userConstants';
import { theme } from '../../../../theme';

const mockUser: User = {
  id: 1,
  nome: 'João Silva',
  email: 'joao@exemplo.com',
  cargo: 'ADMIN',
  status: 'ACTIVE',
  ultimoAcesso: '2024-02-19'
};

const mockOnSubmit = vi.fn();
const mockOnClose = vi.fn();

const renderUserFormModal = (props = {}) => {
  return render(
    <ChakraProvider theme={theme}>
      <UserFormModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        {...props}
      />
    </ChakraProvider>
  );
};

describe('UserFormModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar o modal para criar usuário', () => {
      renderUserFormModal();
      
      expect(screen.getByText(LABELS.ADD_USER)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.NAME)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.EMAIL)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.ROLE)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.STATUS)).toBeInTheDocument();
      expect(screen.getByText(LABELS.SAVE)).toBeInTheDocument();
      expect(screen.getByText(LABELS.CANCEL)).toBeInTheDocument();
    });

    it('deve renderizar o modal para editar usuário', () => {
      renderUserFormModal({ user: mockUser });
      
      expect(screen.getByText(LABELS.EDIT_USER)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.NAME)).toHaveValue(mockUser.nome);
      expect(screen.getByLabelText(LABELS.EMAIL)).toHaveValue(mockUser.email);
      expect(screen.getByLabelText(LABELS.ROLE)).toHaveValue(mockUser.cargo);
      expect(screen.getByLabelText(LABELS.STATUS)).toHaveValue(mockUser.status);
    });
  });

  describe('Validação de Campos', () => {
    it('deve mostrar erro para campos obrigatórios vazios', async () => {
      renderUserFormModal();
      
      fireEvent.click(screen.getByText(LABELS.SAVE));

      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES.REQUIRED_FIELD)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('deve mostrar erro para email inválido', async () => {
      renderUserFormModal();
      
      fireEvent.change(screen.getByLabelText(LABELS.EMAIL), {
        target: { value: 'email-invalido' }
      });
      fireEvent.click(screen.getByText(LABELS.SAVE));

      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES.INVALID_EMAIL)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Submissão do Formulário', () => {
    it('deve chamar onSubmit com dados válidos ao criar usuário', async () => {
      renderUserFormModal();
      
      fireEvent.change(screen.getByLabelText(LABELS.NAME), {
        target: { value: 'Novo Usuário' }
      });
      fireEvent.change(screen.getByLabelText(LABELS.EMAIL), {
        target: { value: 'novo@exemplo.com' }
      });
      fireEvent.change(screen.getByLabelText(LABELS.ROLE), {
        target: { value: 'USER' }
      });
      fireEvent.change(screen.getByLabelText(LABELS.STATUS), {
        target: { value: 'ACTIVE' }
      });

      fireEvent.click(screen.getByText(LABELS.SAVE));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          nome: 'Novo Usuário',
          email: 'novo@exemplo.com',
          cargo: 'USER',
          status: 'ACTIVE'
        });
      });
    });

    it('deve chamar onSubmit com dados válidos ao editar usuário', async () => {
      renderUserFormModal({ user: mockUser });
      
      const novoNome = 'João Silva Atualizado';
      fireEvent.change(screen.getByLabelText(LABELS.NAME), {
        target: { value: novoNome }
      });

      fireEvent.click(screen.getByText(LABELS.SAVE));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          ...mockUser,
          nome: novoNome
        });
      });
    });
  });

  describe('Interações', () => {
    it('deve chamar onClose ao clicar no botão cancelar', () => {
      renderUserFormModal();
      
      fireEvent.click(screen.getByText(LABELS.CANCEL));
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('deve limpar formulário ao fechar modal', async () => {
      const { rerender } = renderUserFormModal({ isOpen: true });
      
      fireEvent.change(screen.getByLabelText(LABELS.NAME), {
        target: { value: 'Teste' }
      });

      rerender(
        <ChakraProvider theme={theme}>
          <UserFormModal
            isOpen={false}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
          />
        </ChakraProvider>
      );

      rerender(
        <ChakraProvider theme={theme}>
          <UserFormModal
            isOpen={true}
            onClose={mockOnClose}
            onSubmit={mockOnSubmit}
          />
        </ChakraProvider>
      );

      expect(screen.getByLabelText(LABELS.NAME)).toHaveValue('');
    });
  });

  describe('Estados de Loading e Erro', () => {
    it('deve desabilitar campos durante loading', () => {
      renderUserFormModal({ isLoading: true });
      
      expect(screen.getByLabelText(LABELS.NAME)).toBeDisabled();
      expect(screen.getByLabelText(LABELS.EMAIL)).toBeDisabled();
      expect(screen.getByLabelText(LABELS.ROLE)).toBeDisabled();
      expect(screen.getByLabelText(LABELS.STATUS)).toBeDisabled();
      expect(screen.getByText(LABELS.SAVE)).toBeDisabled();
    });

    it('deve mostrar mensagem de erro', () => {
      const errorMessage = 'Erro ao salvar usuário';
      renderUserFormModal({ error: errorMessage });
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter labels e descrições adequadas', () => {
      renderUserFormModal();
      
      expect(screen.getByLabelText(LABELS.NAME)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(LABELS.EMAIL)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(LABELS.ROLE)).toHaveAttribute('aria-required', 'true');
      expect(screen.getByLabelText(LABELS.STATUS)).toHaveAttribute('aria-required', 'true');
    });

    it('deve mostrar mensagens de erro para leitores de tela', async () => {
      renderUserFormModal();
      
      fireEvent.click(screen.getByText(LABELS.SAVE));

      await waitFor(() => {
        const errorMessage = screen.getByText(ERROR_MESSAGES.REQUIRED_FIELD);
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });
}); 