import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { vi } from 'vitest';
import LoginForm from '../../../../pages/Login/components/LoginForm';
import { useAuth } from '../../../../pages/Login/hooks/useAuth';
import { theme } from '../../../../theme';
import { LABELS, ERROR_MESSAGES } from '../../../../pages/Login/utils/constants';

// Mock do hook useAuth
vi.mock('../../../../pages/Login/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

const renderLoginForm = () => {
  return render(
    <ChakraProvider theme={theme}>
      <LoginForm />
    </ChakraProvider>
  );
};

describe('LoginForm', () => {
  const mockLogin = vi.fn();
  const mockClearError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: mockClearError
    }));
  });

  describe('Renderização Inicial', () => {
    it('deve renderizar todos os campos e botões', () => {
      renderLoginForm();

      expect(screen.getByLabelText(LABELS.EMAIL)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.PASSWORD)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.REMEMBER_ME)).toBeInTheDocument();
      expect(screen.getByText(LABELS.FORGOT_PASSWORD)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: LABELS.LOGIN_BUTTON })).toBeInTheDocument();
    });

    it('deve iniciar com os campos vazios', () => {
      renderLoginForm();

      expect(screen.getByLabelText(LABELS.EMAIL)).toHaveValue('');
      expect(screen.getByLabelText(LABELS.PASSWORD)).toHaveValue('');
      expect(screen.getByLabelText(LABELS.REMEMBER_ME)).not.toBeChecked();
    });
  });

  describe('Validação de Campos', () => {
    it('deve validar email inválido', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES.INVALID_EMAIL)).toBeInTheDocument();
      });
    });

    it('deve validar senha muito curta', async () => {
      renderLoginForm();

      const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
      fireEvent.change(passwordInput, { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES.MIN_PASSWORD_LENGTH)).toBeInTheDocument();
      });
    });

    it('deve validar campos obrigatórios', async () => {
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES.REQUIRED_EMAIL)).toBeInTheDocument();
        expect(screen.getByText(ERROR_MESSAGES.REQUIRED_PASSWORD)).toBeInTheDocument();
      });
    });
  });

  describe('Submissão do Formulário', () => {
    it('deve chamar login com credenciais válidas', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
      
      fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
      fireEvent.change(passwordInput, { target: { value: 'senha123' } });
      
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'teste@exemplo.com',
          password: 'senha123'
        });
      });
    });

    it('não deve chamar login com credenciais inválidas', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
      
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      fireEvent.change(passwordInput, { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).not.toHaveBeenCalled();
      });
    });
  });

  describe('Estados de Loading e Erro', () => {
    it('deve mostrar spinner durante o loading', () => {
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: mockLogin,
        isLoading: true,
        error: null,
        clearError: mockClearError
      }));

      renderLoginForm();

      expect(screen.getByText('Autenticando...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('deve mostrar mensagem de erro da API', () => {
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: mockLogin,
        isLoading: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS,
        clearError: mockClearError
      }));

      renderLoginForm();

      expect(screen.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS)).toBeInTheDocument();
    });

    it('deve limpar erro ao tentar novo login', async () => {
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: mockLogin,
        isLoading: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS,
        clearError: mockClearError
      }));

      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
      fireEvent.click(submitButton);

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe('Comportamento do Remember Me', () => {
    it('deve atualizar estado do checkbox ao clicar', () => {
      renderLoginForm();

      const checkbox = screen.getByLabelText(LABELS.REMEMBER_ME);
      
      expect(checkbox).not.toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      
      fireEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });
}); 