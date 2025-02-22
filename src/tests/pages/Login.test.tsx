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

    // Limpa localStorage e mocks
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('deve renderizar o título corretamente', () => {
    renderLoginPage();
    expect(screen.getByText('Bem-vindo de volta!')).toBeInTheDocument();
  });

  it('deve renderizar o subtítulo corretamente', () => {
    renderLoginPage();
    expect(
      screen.getByText('Faça login para acessar o painel administrativo')
    ).toBeInTheDocument();
  });

  it('deve renderizar o campo de email', () => {
    renderLoginPage();
    expect(screen.getByLabelText(LABELS.EMAIL)).toBeInTheDocument();
  });

  it('deve renderizar o campo de senha', () => {
    renderLoginPage();
    expect(screen.getByLabelText(LABELS.PASSWORD)).toBeInTheDocument();
  });

  it('deve renderizar a opção de lembrar-me', () => {
    renderLoginPage();
    expect(screen.getByLabelText(LABELS.REMEMBER_ME)).toBeInTheDocument();
  });

  it('deve renderizar o link de esqueci minha senha', () => {
    renderLoginPage();
    expect(screen.getByText(LABELS.FORGOT_PASSWORD)).toBeInTheDocument();
  });

  it('deve renderizar o botão de login', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: LABELS.LOGIN_BUTTON })).toBeInTheDocument();
  });

  it('deve renderizar o logo com atributos corretos', () => {
    renderLoginPage();
    const logo = screen.getByAltText('Dashboard Lab');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

  it('deve mostrar erro quando o email tem formato inválido', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(LABELS.EMAIL);
    const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

    fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(ERROR_MESSAGES.INVALID_EMAIL);
    expect(errorMessage).toBeInTheDocument();
  });

  it('deve mostrar erro quando a senha é menor que o tamanho mínimo', async () => {
    renderLoginPage();
    
    const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
    const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByText(ERROR_MESSAGES.MIN_PASSWORD_LENGTH);
    expect(errorMessage).toBeInTheDocument();
  });

  it('deve mostrar erro quando o email está vazio', async () => {
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
    fireEvent.click(submitButton);

    const emailError = await screen.findByText(ERROR_MESSAGES.REQUIRED_EMAIL);
    expect(emailError).toBeInTheDocument();
  });

  it('deve mostrar erro quando a senha está vazia', async () => {
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });
    fireEvent.click(submitButton);

    const passwordError = await screen.findByText(ERROR_MESSAGES.REQUIRED_PASSWORD);
    expect(passwordError).toBeInTheDocument();
  });

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

  it('deve exibir indicador de carregamento durante autenticação', () => {
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

  it('deve exibir mensagem quando autenticação falha', () => {
    (useAuth as jest.Mock).mockImplementation(() => ({
      login: vi.fn(),
      isLoading: false,
      error: ERROR_MESSAGES.INVALID_CREDENTIALS,
      clearError: vi.fn()
    }));

    renderLoginPage();
    
    expect(screen.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS)).toBeInTheDocument();
  });

  it('deve limpar mensagens de erro ao tentar novo login', async () => {
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

  it('deve iniciar com checkbox "Lembrar-me" desmarcado', () => {
    renderLoginPage();
    const rememberMeCheckbox = screen.getByLabelText(LABELS.REMEMBER_ME);
    expect(rememberMeCheckbox).not.toBeChecked();
  });

  it('deve permitir marcar checkbox "Lembrar-me"', () => {
    renderLoginPage();
    const rememberMeCheckbox = screen.getByLabelText(LABELS.REMEMBER_ME);
    
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).toBeChecked();
  });

  it('deve permitir desmarcar checkbox "Lembrar-me"', () => {
    renderLoginPage();
    const rememberMeCheckbox = screen.getByLabelText(LABELS.REMEMBER_ME);
    
    fireEvent.click(rememberMeCheckbox);
    fireEvent.click(rememberMeCheckbox);
    expect(rememberMeCheckbox).not.toBeChecked();
  });

  it('deve enviar flag remember=true quando "Lembrar-me" estiver marcado', async () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    (useAuth as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: vi.fn()
    }));

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(LABELS.EMAIL);
    const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
    const rememberMeCheckbox = screen.getByLabelText(LABELS.REMEMBER_ME);
    const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });
    fireEvent.click(rememberMeCheckbox);
    
    await waitFor(() => {
      fireEvent.click(submitButton);
    });

    expect(mockLogin).toHaveBeenCalledWith({
      email: 'teste@exemplo.com',
      password: 'senha123',
      remember: true
    });
  });

  it('deve carregar credenciais salvas ao iniciar a página', () => {
    // Simula credenciais salvas no localStorage
    localStorage.setItem('savedCredentials', JSON.stringify({
      email: 'teste@exemplo.com',
      password: 'senha123',
      remember: true
    }));

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
    
    const emailInput = screen.getByLabelText(LABELS.EMAIL) as HTMLInputElement;
    const rememberMeCheckbox = screen.getByLabelText(LABELS.REMEMBER_ME) as HTMLInputElement;

    expect(mockLoadCredentials).toHaveBeenCalled();
    expect(emailInput.value).toBe('teste@exemplo.com');
    expect(rememberMeCheckbox.checked).toBe(true);
  });

  it('deve navegar para página de recuperação ao clicar em "Esqueci minha senha"', () => {
    renderLoginPage();
    
    const forgotPasswordLink = screen.getByText(LABELS.FORGOT_PASSWORD);
    fireEvent.click(forgotPasswordLink);

    expect(mockNavigate).toHaveBeenCalledWith('/recuperar-senha');
  });

  it('deve bloquear login após três tentativas falhas', async () => {
    let loginAttempts = 0;
    const mockLogin = vi.fn().mockImplementation(async () => {
      loginAttempts++;
      if (loginAttempts >= 3) {
        throw new Error(ERROR_MESSAGES.TOO_MANY_ATTEMPTS);
      }
      throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
    });

    const mockClearError = vi.fn();
    
    (useAuth as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      isLoading: false,
      error: loginAttempts >= 3 ? ERROR_MESSAGES.TOO_MANY_ATTEMPTS : ERROR_MESSAGES.INVALID_CREDENTIALS,
      clearError: mockClearError,
      loginAttempts
    }));

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(LABELS.EMAIL);
    const passwordInput = screen.getByLabelText(LABELS.PASSWORD);
    const submitButton = screen.getByRole('button', { name: LABELS.LOGIN_BUTTON });

    // Preenche os campos uma única vez
    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha_errada' } });

    // Primeira tentativa
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS)).toBeInTheDocument();
      expect(mockClearError).toHaveBeenCalled();
    });

    // Segunda tentativa
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.INVALID_CREDENTIALS)).toBeInTheDocument();
      expect(mockClearError).toHaveBeenCalledTimes(2);
    });

    // Terceira tentativa - deve bloquear
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(ERROR_MESSAGES.TOO_MANY_ATTEMPTS)).toBeInTheDocument();
      expect(submitButton).toBeDisabled();
      expect(mockClearError).toHaveBeenCalledTimes(3);
    });
  });

  it('deve redirecionar para última página acessada após login bem-sucedido', async () => {
    const mockLogin = vi.fn().mockResolvedValue({});
    
    (useAuth as jest.Mock).mockImplementation(() => ({
      login: mockLogin,
      isLoading: false,
      error: null,
      clearError: vi.fn()
    }));

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