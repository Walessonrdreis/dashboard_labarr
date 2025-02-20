import { validateEmail, validatePassword, formatErrorMessage } from '../../../../pages/Login/utils/helpers';
import { ERROR_MESSAGES } from '../../../../pages/Login/utils/constants';

describe('Funções Helpers de Autenticação', () => {
  describe('validateEmail', () => {
    it('deve retornar null para email válido', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+tag@domain.co.uk',
        'user123@subdomain.domain.com'
      ];

      validEmails.forEach(email => {
        expect(validateEmail(email)).toBeNull();
      });
    });

    it('deve retornar erro para email vazio', () => {
      expect(validateEmail('')).toBe(ERROR_MESSAGES.REQUIRED_EMAIL);
    });

    it('deve retornar erro para email inválido', () => {
      const invalidEmails = [
        'invalid-email',
        'user@',
        '@domain.com',
        'user@domain',
        'user.domain.com',
        'user@.com',
        'user@domain.',
        'user space@domain.com'
      ];

      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(ERROR_MESSAGES.INVALID_EMAIL);
      });
    });
  });

  describe('validatePassword', () => {
    it('deve retornar null para senha válida', () => {
      const validPasswords = [
        'password123',
        'securePassword',
        '123456789',
        'pass word 123',
        'ValidPass123!'
      ];

      validPasswords.forEach(password => {
        expect(validatePassword(password)).toBeNull();
      });
    });

    it('deve retornar erro para senha vazia', () => {
      expect(validatePassword('')).toBe(ERROR_MESSAGES.REQUIRED_PASSWORD);
    });

    it('deve retornar erro para senha muito curta', () => {
      const shortPasswords = [
        '12345',
        'pass',
        'abc',
        '1',
        'a'
      ];

      shortPasswords.forEach(password => {
        expect(validatePassword(password)).toBe(ERROR_MESSAGES.MIN_PASSWORD_LENGTH);
      });
    });
  });

  describe('formatErrorMessage', () => {
    it('deve formatar erro da API com mensagem', () => {
      const apiError = {
        response: {
          data: {
            message: 'Erro específico da API'
          }
        }
      };

      expect(formatErrorMessage(apiError)).toBe('Erro específico da API');
    });

    it('deve retornar mensagem padrão para erro de rede', () => {
      const networkError = {
        message: 'Network Error'
      };

      expect(formatErrorMessage(networkError)).toBe(ERROR_MESSAGES.NETWORK_ERROR);
    });

    it('deve retornar mensagem padrão para erro do servidor', () => {
      const serverError = {
        message: 'Internal Server Error'
      };

      expect(formatErrorMessage(serverError)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('deve lidar com erro sem estrutura definida', () => {
      const unknownError = 'Erro desconhecido';
      expect(formatErrorMessage(unknownError)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('deve lidar com erro nulo ou undefined', () => {
      expect(formatErrorMessage(null)).toBe(ERROR_MESSAGES.SERVER_ERROR);
      expect(formatErrorMessage(undefined)).toBe(ERROR_MESSAGES.SERVER_ERROR);
    });

    it('deve formatar erros com diferentes estruturas', () => {
      const errors = [
        { response: { data: { error: 'Erro 1' } } },
        { response: { status: 500, statusText: 'Internal Server Error' } },
        { message: 'Error message' },
        new Error('Error object')
      ];

      errors.forEach(error => {
        expect(typeof formatErrorMessage(error)).toBe('string');
      });
    });
  });
}); 