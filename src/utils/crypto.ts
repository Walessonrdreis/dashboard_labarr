import CryptoJS from 'crypto-js';

export class CryptoUtil {
  private static readonly CRYPTO_KEY = process.env.SECRET_KEY || 'chave_padrao';

  // Criptografa um texto
  static encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.CRYPTO_KEY).toString();
  }

  // Descriptografa um texto
  static decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.CRYPTO_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Salva credenciais criptografadas em um arquivo
  static saveCredentials(credentials: Record<string, string>): string {
    const encryptedData = this.encrypt(JSON.stringify(credentials));
    return encryptedData;
  }

  // Lê credenciais de um arquivo criptografado
  static loadCredentials(encryptedData: string): Record<string, string> {
    try {
      const decryptedData = this.decrypt(encryptedData);
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Erro ao carregar credenciais:', error);
      return {};
    }
  }
} 