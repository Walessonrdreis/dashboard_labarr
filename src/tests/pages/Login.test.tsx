import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { vi } from 'vitest';
import Login from '../../pages/Login';
import { useAuth } from '../../pages/Login/hooks/useAuth';
import { theme } from '../../theme';
import { ERROR_MESSAGES, LABELS } from '../../pages/Login/utils/constants';

// No início do arquivo, onde estão os mocks
const mockNavigate = vi.fn();

// Mock do hook useAuth
vi.mock('../../pages/Login/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

// Ajuste o mock do react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const renderLoginPage = () => {
  return render(
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </ChakraProvider>
  );
};

describe('Página de Login', () => {
  beforeEach(() => {
    // Reset do mock do useAuth antes de cada teste
    (useAuth as jest.Mock).mockImplementation(() => ({
      login: vi.fn(),
      isLoading: false,
      error: null,
      clearError: vi.fn()
    }));
  });

  describe('Renderização', () => {
    it('deve renderizar o título e subtítulo corretamente', () => {
      renderLoginPage();
      
      expect(screen.getByText('Bem-vindo de volta!')).toBeInTheDocument();
      expect(
        screen.getByText('Faça login para acessar o painel administrativo')
      ).toBeInTheDocument();
    });

    it('deve renderizar todos os campos do formulário', () => {
      renderLoginPage();
      
      expect(screen.getByLabelText(LABELS.EMAIL)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.PASSWORD)).toBeInTheDocument();
      expect(screen.getByLabelText(LABELS.REMEMBER_ME)).toBeInTheDocument();
      expect(screen.getByText(LABELS.FORGOT_PASSWORD)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: LABELS.LOGIN_BUTTON })).toBeInTheDocument();
    });

    it('deve renderizar o logo', () => {
      renderLoginPage();
      
      const logo = screen.getByAltText('Dashboard Lab');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo.png');
    });
  });

  describe('Validação do Formulário', () => {
    it('deve mostrar erro quando o email é inválido', async () => {
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      fireEvent.click(submitButton);

      const errorMessage = await screen.findByText(ERROR_MESSAGES.INVALID_EMAIL);
      expect(errorMessage).toBeInTheDocument();
    });

    it('deve mostrar erro quando a senha é muito curta', async () => {
      renderLoginPage();
      
      const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

      fireEvent.change(passwordInput, { target: { value: '123' } });
      fireEvent.click(submitButton);

      const errorMessage = await screen.findByText(ERROR_MESSAGES.MIN_PASSWORD_LENGTH);
      expect(errorMessage).toBeInTheDocument();
    });

    it('deve mostrar erro quando os campos estão vazios', async () => {
      renderLoginPage();
      
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
      fireEvent.click(submitButton);

      const emailError = await screen.findByText(ERROR_MESSAGES.REQUIRED_EMAIL);
      const passwordError = await screen.findByText(ERROR_MESSAGES.REQUIRED_PASSWORD);

      expect(emailError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
    });
  });

  describe('Interação e Estados', () => {
    it('deve chamar a função login com as credenciais corretas', async () => {
      const mockLogin = vi.fn();
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: mockLogin,
        isLoading: false,
        error: null,
        clearError: vi.fn()
      }));

      renderLoginPage();
      
      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

      fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
      fireEvent.change(passwordInput, { target: { value: 'senha123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'teste@exemplo.com',
          password: 'senha123'
        });
      });
    });

    it('deve mostrar o spinner de loading durante a autenticação', () => {
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: vi.fn(),
        isLoading: true,
        error: null,
        clearError: vi.fn()
      }));

      renderLoginPage();
      
      expect(screen.getByText('Autenticando...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('deve mostrar mensagem de erro quando a autenticação falha', () => {
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: vi.fn(),
        isLoading: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS,
        clearError: vi.fn()
      }));

      renderLoginPage();
      
      expect(screen.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS)).toBeInTheDocument();
    });

    it('deve limpar os erros ao tentar fazer login novamente', async () => {
      const mockClearError = vi.fn();
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: vi.fn(),
        isLoading: false,
        error: ERROR_MESSAGES.INVALID_CREDENTIALS,
        clearError: mockClearError
      }));

      renderLoginPage();
      
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
      fireEvent.click(submitButton);

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe('Comportamento do "Lembrar-me"', () => {
    beforeEach(() => {
      localStorage.clear();
      vi.clearAllMocks();
    });

    it('deve permitir marcar e desmarcar a opção "Lembrar-me"', () => {
      renderLoginPage();
      
      const rememberMeCheckbox = screen.getByLabelText(LABELS.REMEMBER_ME);
      
      expect(rememberMeCheckbox).not.toBeChecked();
      
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();
      
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).not.toBeChecked();
    });

    it('deve salvar credenciais quando "Lembrar-me" estiver marcado', async () => {
      // Mock da função de login para simular sucesso
      const mockLogin = vi.fn().mockResolvedValue({});
      
      // Mock do hook useAuth com a função de login mockada
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: mockLogin,
        isLoading: false,
        error: null,
        clearError: vi.fn()
      }));

      renderLoginPage();
      
      // Preenche o formulário
      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
      const rememberMeCheckbox = screen.getByLabelText(LABELS.REMEMBER_ME);
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

      fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
      fireEvent.change(passwordInput, { target: { value: 'senha123' } });
      fireEvent.click(rememberMeCheckbox);
      
      // Submete o formulário
      await waitFor(() => {
        fireEvent.click(submitButton);
      });

      // Verifica se o login foi chamado com os parâmetros corretos
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'teste@exemplo.com',
        password: 'senha123',
        remember: true
      });
    });
  });

  describe('Persistência de Credenciais', () => {
    it('deve carregar credenciais salvas ao iniciar', () => {
      const mockLoadCredentials = vi.fn().mockReturnValue({
        email: 'teste@exemplo.com',
        password: 'senha123'
      });

      (useAuth as jest.Mock).mockImplementation(() => ({
        login: vi.fn(),
        isLoading: false,
        error: null,
        clearError: vi.fn(),
        loadCredentials: mockLoadCredentials
      }));

      renderLoginPage();
      
      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      const rememberMeCheckbox = screen.getByLabelText(LABELS.REMEMBER_ME);

      expect(mockLoadCredentials).toHaveBeenCalled();
      expect(emailInput).toHaveValue('teste@exemplo.com');
      expect(rememberMeCheckbox).toBeChecked();
    });
  });

  describe('Recuperação de Senha', () => {
    it('deve navegar para página de recuperação ao clicar em "Esqueci minha senha"', () => {
      renderLoginPage();
      
      const forgotPasswordLink = screen.getByText(LABELS.FORGOT_PASSWORD);
      fireEvent.click(forgotPasswordLink);

      expect(mockNavigate).toHaveBeenCalledWith('/recuperar-senha');
    });
  });

  describe('Tentativas de Login', () => {
    it('deve bloquear login após múltiplas tentativas falhas', async () => {
      let loginAttempts = 0;
      const mockLogin = vi.fn().mockImplementation(async () => {
        loginAttempts++;
        // Após 3 tentativas, simula bloqueio
        if (loginAttempts >= 3) {
          throw new Error(ERROR_MESSAGES.TOO_MANY_ATTEMPTS);
        }
        throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
      });

      (useAuth as jest.Mock).mockImplementation(() => ({
        login: mockLogin,
        isLoading: false,
        error: loginAttempts >= 3 ? ERROR_MESSAGES.TOO_MANY_ATTEMPTS : ERROR_MESSAGES.INVALID_CREDENTIALS,
        clearError: vi.fn(),
        loginAttempts
      }));

      renderLoginPage();
      
      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

      // Primeira tentativa
      fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
      fireEvent.change(passwordInput, { target: { value: 'senha_errada' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS)).toBeInTheDocument();
      });

      // Segunda tentativa
      fireEvent.click(submitButton);
      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS)).toBeInTheDocument();
      });

      // Terceira tentativa - deve bloquear
      fireEvent.click(submitButton);
      
      // Verifica se mostra mensagem de bloqueio e desabilita o botão
      await waitFor(() => {
        expect(screen.getByText(ERROR_MESSAGES.TOO_MANY_ATTEMPTS)).toBeInTheDocument();
        expect(submitButton).toBeDisabled();
      });
    });
  });

  describe('Redirecionamento', () => {
    it('deve redirecionar para última página acessada após login', async () => {
      const mockLogin = vi.fn().mockResolvedValue({});
      
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: mockLogin,
        isLoading: false,
        error: null,
        clearError: vi.fn()
      }));

      // Simula última página acessada
      sessionStorage.setItem('lastPath', '/dashboard/relatorios');
      
      renderLoginPage();
      
      const emailInput = screen.getByLabelText(LABELS.EMAIL);
      const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
      const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

      fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
      fireEvent.change(passwordInput, { target: { value: 'senha123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard/relatorios');
      });
    });
  });
}); 