import {
  formatUserName,
  formatDate,
  validateEmail,
  validateUser,
  sortUsers,
  filterUsers,
  formatUserRole,
  formatUserStatus,
} from '../../../../pages/Users/utils/userHelpers';

describe('Funções Utilitárias de Usuários', () => {
  describe('formatUserName', () => {
    it('deve formatar nome completo corretamente', () => {
      expect(formatUserName('João', 'Silva')).toBe('João Silva');
      expect(formatUserName('Maria', 'dos Santos')).toBe('Maria dos Santos');
    });

    it('deve lidar com nomes vazios ou undefined', () => {
      expect(formatUserName('João')).toBe('João');
      expect(formatUserName('', 'Silva')).toBe('Silva');
      expect(formatUserName()).toBe('');
    });

    it('deve remover espaços extras', () => {
      expect(formatUserName('João  ', '  Silva')).toBe('João Silva');
      expect(formatUserName('  Maria  ', '  Santos  ')).toBe('Maria Santos');
    });
  });

  describe('formatDate', () => {
    it('deve formatar data corretamente', () => {
      expect(formatDate('2024-02-19')).toBe('19/02/2024');
      expect(formatDate('2024-02-19T15:30:00')).toBe('19/02/2024');
    });

    it('deve retornar string vazia para data inválida', () => {
      expect(formatDate('data-invalida')).toBe('');
      expect(formatDate('')).toBe('');
      expect(formatDate(undefined)).toBe('');
    });

    it('deve formatar data com timezone', () => {
      expect(formatDate('2024-02-19T15:30:00Z')).toBe('19/02/2024');
      expect(formatDate('2024-02-19T15:30:00-03:00')).toBe('19/02/2024');
    });
  });

  describe('validateEmail', () => {
    it('deve validar emails corretos', () => {
      expect(validateEmail('usuario@exemplo.com')).toBe(true);
      expect(validateEmail('usuario.nome@dominio.com.br')).toBe(true);
      expect(validateEmail('usuario+tag@dominio.co.uk')).toBe(true);
    });

    it('deve invalidar emails incorretos', () => {
      expect(validateEmail('email-invalido')).toBe(false);
      expect(validateEmail('@dominio.com')).toBe(false);
      expect(validateEmail('usuario@')).toBe(false);
      expect(validateEmail('usuario@dominio')).toBe(false);
    });

    it('deve lidar com valores vazios ou undefined', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail(null)).toBe(false);
    });
  });

  describe('validateUser', () => {
    const validUser = {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cargo: 'Usuário',
      status: 'Ativo'
    };

    it('deve validar usuário correto', () => {
      expect(validateUser(validUser)).toBe(true);
    });

    it('deve invalidar usuário com campos faltando', () => {
      expect(validateUser({ ...validUser, nome: '' })).toBe(false);
      expect(validateUser({ ...validUser, email: undefined })).toBe(false);
      expect(validateUser({ ...validUser, cargo: null })).toBe(false);
    });

    it('deve invalidar usuário com email incorreto', () => {
      expect(validateUser({ ...validUser, email: 'email-invalido' })).toBe(false);
    });

    it('deve invalidar usuário com cargo não permitido', () => {
      expect(validateUser({ ...validUser, cargo: 'Cargo Inválido' })).toBe(false);
    });

    it('deve invalidar usuário com status não permitido', () => {
      expect(validateUser({ ...validUser, status: 'Status Inválido' })).toBe(false);
    });
  });

  describe('sortUsers', () => {
    const users = [
      { id: 1, nome: 'João', email: 'joao@exemplo.com' },
      { id: 2, nome: 'Ana', email: 'ana@exemplo.com' },
      { id: 3, nome: 'Carlos', email: 'carlos@exemplo.com' }
    ];

    it('deve ordenar usuários por nome', () => {
      const sorted = sortUsers(users, 'nome', 'asc');
      expect(sorted[0].nome).toBe('Ana');
      expect(sorted[1].nome).toBe('Carlos');
      expect(sorted[2].nome).toBe('João');
    });

    it('deve ordenar usuários por email', () => {
      const sorted = sortUsers(users, 'email', 'asc');
      expect(sorted[0].email).toBe('ana@exemplo.com');
      expect(sorted[1].email).toBe('carlos@exemplo.com');
      expect(sorted[2].email).toBe('joao@exemplo.com');
    });

    it('deve ordenar em ordem descendente', () => {
      const sorted = sortUsers(users, 'nome', 'desc');
      expect(sorted[0].nome).toBe('João');
      expect(sorted[1].nome).toBe('Carlos');
      expect(sorted[2].nome).toBe('Ana');
    });

    it('deve manter ordem original se campo não existir', () => {
      const sorted = sortUsers(users, 'campoInexistente', 'asc');
      expect(sorted).toEqual(users);
    });
  });

  describe('filterUsers', () => {
    const users = [
      { id: 1, nome: 'João Silva', email: 'joao@exemplo.com', status: 'Ativo' },
      { id: 2, nome: 'Maria Santos', email: 'maria@exemplo.com', status: 'Inativo' },
      { id: 3, nome: 'Pedro Costa', email: 'pedro@exemplo.com', status: 'Ativo' }
    ];

    it('deve filtrar por termo de busca no nome', () => {
      const filtered = filterUsers(users, 'Silva', undefined);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].nome).toBe('João Silva');
    });

    it('deve filtrar por termo de busca no email', () => {
      const filtered = filterUsers(users, 'maria@', undefined);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].email).toBe('maria@exemplo.com');
    });

    it('deve filtrar por status', () => {
      const filtered = filterUsers(users, undefined, 'Ativo');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(user => user.status === 'Ativo')).toBe(true);
    });

    it('deve combinar filtros de busca e status', () => {
      const filtered = filterUsers(users, 'Silva', 'Ativo');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].nome).toBe('João Silva');
      expect(filtered[0].status).toBe('Ativo');
    });

    it('deve retornar todos os usuários sem filtros', () => {
      const filtered = filterUsers(users, undefined, undefined);
      expect(filtered).toEqual(users);
    });
  });

  describe('formatUserRole', () => {
    it('deve formatar cargo corretamente', () => {
      expect(formatUserRole('ADMIN')).toBe('Administrador');
      expect(formatUserRole('USER')).toBe('Usuário');
      expect(formatUserRole('MANAGER')).toBe('Gerente');
    });

    it('deve lidar com cargos desconhecidos', () => {
      expect(formatUserRole('UNKNOWN')).toBe('Desconhecido');
      expect(formatUserRole('')).toBe('Desconhecido');
      expect(formatUserRole(undefined)).toBe('Desconhecido');
    });

    it('deve preservar capitalização correta', () => {
      expect(formatUserRole('admin')).toBe('Administrador');
      expect(formatUserRole('ADMIN')).toBe('Administrador');
      expect(formatUserRole('Admin')).toBe('Administrador');
    });
  });

  describe('formatUserStatus', () => {
    it('deve formatar status corretamente', () => {
      expect(formatUserStatus('ACTIVE')).toBe('Ativo');
      expect(formatUserStatus('INACTIVE')).toBe('Inativo');
      expect(formatUserStatus('PENDING')).toBe('Pendente');
    });

    it('deve lidar com status desconhecidos', () => {
      expect(formatUserStatus('UNKNOWN')).toBe('Desconhecido');
      expect(formatUserStatus('')).toBe('Desconhecido');
      expect(formatUserStatus(undefined)).toBe('Desconhecido');
    });

    it('deve preservar capitalização correta', () => {
      expect(formatUserStatus('active')).toBe('Ativo');
      expect(formatUserStatus('ACTIVE')).toBe('Ativo');
      expect(formatUserStatus('Active')).toBe('Ativo');
    });
  });
}); 