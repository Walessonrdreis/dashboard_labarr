import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import Users from '../../../pages/Users/Users';
import { theme } from '../../../theme';

// Mock dos componentes
vi.mock('../../../components/Layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-layout">{children}</div>,
}));

vi.mock('../../../components/Card/Card', () => ({
  default: ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div data-testid="mock-card" data-title={title}>
      {children}
    </div>
  ),
}));

vi.mock('../../../components/Table/Table', () => ({
  default: ({ data }: { data: any[] }) => (
    <div data-testid="mock-table">
      {data.map((item) => (
        <div key={item.id} data-testid="table-row">
          {item.nome}
        </div>
      ))}
    </div>
  ),
}));

const renderUsersPage = () => {
  return render(
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <Users />
      </BrowserRouter>
    </ChakraProvider>
  );
};

describe('Página Users', () => {
  describe('Renderização', () => {
    it('deve renderizar o título da página', () => {
      renderUsersPage();
      expect(screen.getByText('Usuários')).toBeInTheDocument();
    });

    it('deve renderizar o botão de adicionar usuário', () => {
      renderUsersPage();
      expect(screen.getByText('Adicionar Usuário')).toBeInTheDocument();
    });

    it('deve renderizar o campo de busca', () => {
      renderUsersPage();
      expect(screen.getByPlaceholderText('Buscar usuários...')).toBeInTheDocument();
    });

    it('deve renderizar os cards de estatísticas', () => {
      renderUsersPage();
      
      const cards = screen.getAllByTestId('mock-card');
      const cardTitles = cards.map(card => card.getAttribute('data-title'));
      
      expect(cardTitles).toContain('Total de Usuários');
      expect(cardTitles).toContain('Usuários Ativos');
      expect(cardTitles).toContain('Usuários Inativos');
    });

    it('deve renderizar a tabela de usuários', () => {
      renderUsersPage();
      expect(screen.getByTestId('mock-table')).toBeInTheDocument();
    });
  });

  describe('Funcionalidade de Busca', () => {
    it('deve filtrar usuários ao digitar no campo de busca', async () => {
      renderUsersPage();
      
      const searchInput = screen.getByPlaceholderText('Buscar usuários...');
      fireEvent.change(searchInput, { target: { value: 'João' } });

      await waitFor(() => {
        const tableRows = screen.getAllByTestId('table-row');
        expect(tableRows).toHaveLength(1);
        expect(tableRows[0]).toHaveTextContent('João Silva');
      });
    });

    it('deve mostrar todos os usuários quando o campo de busca está vazio', () => {
      renderUsersPage();
      
      const tableRows = screen.getAllByTestId('table-row');
      expect(tableRows).toHaveLength(3); // Número total de usuários mock
    });

    it('deve ser case-insensitive na busca', async () => {
      renderUsersPage();
      
      const searchInput = screen.getByPlaceholderText('Buscar usuários...');
      fireEvent.change(searchInput, { target: { value: 'joão' } });

      await waitFor(() => {
        const tableRows = screen.getAllByTestId('table-row');
        expect(tableRows).toHaveLength(1);
        expect(tableRows[0]).toHaveTextContent('João Silva');
      });
    });
  });

  describe('Estatísticas', () => {
    it('deve mostrar o número correto de usuários totais', () => {
      renderUsersPage();
      
      const totalCard = screen.getByTestId('mock-card');
      expect(totalCard).toHaveTextContent('3'); // Total de usuários mock
    });

    it('deve mostrar o número correto de usuários ativos', () => {
      renderUsersPage();
      
      const cards = screen.getAllByTestId('mock-card');
      const ativosCard = cards.find(card => card.getAttribute('data-title') === 'Usuários Ativos');
      expect(ativosCard).toHaveTextContent('2'); // Usuários ativos mock
    });

    it('deve mostrar o número correto de usuários inativos', () => {
      renderUsersPage();
      
      const cards = screen.getAllByTestId('mock-card');
      const inativosCard = cards.find(card => card.getAttribute('data-title') === 'Usuários Inativos');
      expect(inativosCard).toHaveTextContent('1'); // Usuários inativos mock
    });
  });
}); 