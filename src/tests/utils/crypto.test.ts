import { CryptoUtil } from '../../utils/crypto';
import { vi } from 'vitest';

describe('CryptoUtil', () => {
  const testKey = 'chave_teste_123';
  const testData = {
    username: 'admin',
    password: '123456'
  };

  beforeEach(() => {
    // Mock da variável de ambiente
    process.env.SECRET_KEY = testKey;
    // Limpa o localStorage antes de cada teste
    localStorage.clear();
  });

  describe('encrypt', () => {
    it('deve criptografar texto corretamente', () => {
      const text = 'texto_secreto';
      const encrypted = CryptoUtil.encrypt(text);

      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      expect(encrypted).not.toBe(text);
    });

    it('deve gerar diferentes outputs para o mesmo input', () => {
      const text = 'texto_secreto';
      const firstEncryption = CryptoUtil.encrypt(text);
      const secondEncryption = CryptoUtil.encrypt(text);

      expect(firstEncryption).not.toBe(secondEncryption);
    });
  });

  describe('decrypt', () => {
    it('deve descriptografar texto corretamente', () => {
      const originalText = 'texto_secreto';
      const encrypted = CryptoUtil.encrypt(originalText);
      const decrypted = CryptoUtil.decrypt(encrypted);

      expect(decrypted).toBe(originalText);
    });

    it('deve lançar erro ao tentar descriptografar texto inválido', () => {
      expect(() => CryptoUtil.decrypt('texto_invalido')).toThrow();
    });
  });

  describe('saveCredentials', () => {
    it('deve criptografar credenciais corretamente', () => {
      const encrypted = CryptoUtil.saveCredentials(testData);

      expect(encrypted).toBeDefined();
      expect(typeof encrypted).toBe('string');
      
      // Verifica se pode ser descriptografado
      const decrypted = CryptoUtil.decrypt(encrypted);
      expect(JSON.parse(decrypted)).toEqual(testData);
    });

    it('deve gerar diferentes outputs para as mesmas credenciais', () => {
      const firstSave = CryptoUtil.saveCredentials(testData);
      const secondSave = CryptoUtil.saveCredentials(testData);

      expect(firstSave).not.toBe(secondSave);
    });
  });

  describe('loadCredentials', () => {
    it('deve carregar credenciais criptografadas corretamente', () => {
      const encrypted = CryptoUtil.saveCredentials(testData);
      const loaded = CryptoUtil.loadCredentials(encrypted);

      expect(loaded).toEqual(testData);
    });

    it('deve retornar objeto vazio em caso de erro', () => {
      const result = CryptoUtil.loadCredentials('dados_invalidos');
      expect(result).toEqual({});
    });

    it('deve manter tipos de dados originais', () => {
      interface ComplexData {
        numberStr: string;
        string: string;
        booleanStr: string;
        arrayStr: string;
        objectStr: string;
      }

      const complexData = {
        numberStr: '123',
        string: 'texto',
        booleanStr: 'true',
        arrayStr: JSON.stringify([1, 2, 3]),
        objectStr: JSON.stringify({ key: 'value' })
      };

      const encrypted = CryptoUtil.saveCredentials(complexData);
      const loaded = CryptoUtil.loadCredentials<ComplexData>(encrypted);

      expect(loaded).toEqual(complexData);
      expect(loaded.numberStr).toBe('123');
      expect(loaded.string).toBe('texto');
      expect(loaded.booleanStr).toBe('true');
      expect(loaded.arrayStr).toBe('[1,2,3]');
      expect(loaded.objectStr).toBe('{"key":"value"}');
    });
  });
}); 