import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { vi } from 'vitest';
import Login from '../../pages/Login';
import { useAuth } from '../../pages/Login/hooks/useAuth';
import { theme } from '../../theme';

// Mock do hook useAuth
vi.mock('../../pages/Login/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

// Mock do hook useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
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
      
      expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
      expect(screen.getByLabelText('Senha')).toBeInTheDocument();
      expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument();
      expect(screen.getByText('Esqueceu a senha?')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
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
      
      const emailInput = screen.getByLabelText('E-mail');
      fireEvent.change(emailInput, { target: { value: 'email-invalido' } });
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      fireEvent.click(submitButton);

      expect(await screen.findByText('Digite um e-mail válido')).toBeInTheDocument();
    });

    it('deve mostrar erro quando a senha é muito curta', async () => {
      renderLoginPage();
      
      const passwordInput = screen.getByLabelText('Senha');
      fireEvent.change(passwordInput, { target: { value: '123' } });
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      fireEvent.click(submitButton);

      expect(await screen.findByText('A senha deve ter no mínimo 6 caracteres')).toBeInTheDocument();
    });

    it('deve mostrar erro quando os campos estão vazios', async () => {
      renderLoginPage();
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      fireEvent.click(submitButton);

      expect(await screen.findByText('O e-mail é obrigatório')).toBeInTheDocument();
      expect(await screen.findByText('A senha é obrigatória')).toBeInTheDocument();
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
      
      const emailInput = screen.getByLabelText('E-mail');
      const passwordInput = screen.getByLabelText('Senha');
      
      fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
      fireEvent.change(passwordInput, { target: { value: 'senha123' } });
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' });
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
      expect(screen.getByRole('status')).toBeInTheDocument(); // Spinner
    });

    it('deve mostrar mensagem de erro quando a autenticação falha', () => {
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: vi.fn(),
        isLoading: false,
        error: 'E-mail ou senha inválidos',
        clearError: vi.fn()
      }));

      renderLoginPage();
      
      expect(screen.getByText('E-mail ou senha inválidos')).toBeInTheDocument();
    });

    it('deve limpar os erros ao tentar fazer login novamente', async () => {
      const mockClearError = vi.fn();
      (useAuth as jest.Mock).mockImplementation(() => ({
        login: vi.fn(),
        isLoading: false,
        error: 'E-mail ou senha inválidos',
        clearError: mockClearError
      }));

      renderLoginPage();
      
      const submitButton = screen.getByRole('button', { name: 'Entrar' });
      fireEvent.click(submitButton);

      expect(mockClearError).toHaveBeenCalled();
    });
  });

  describe('Comportamento do "Lembrar-me"', () => {
    it('deve permitir marcar e desmarcar a opção "Lembrar-me"', () => {
      renderLoginPage();
      
      const rememberMeCheckbox = screen.getByLabelText('Lembrar-me');
      
      expect(rememberMeCheckbox).not.toBeChecked();
      
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).toBeChecked();
      
      fireEvent.click(rememberMeCheckbox);
      expect(rememberMeCheckbox).not.toBeChecked();
    });
  });
}); 