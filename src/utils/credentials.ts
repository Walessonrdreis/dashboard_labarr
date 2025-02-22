import fs from 'fs';
import path from 'path';
import { CryptoUtil } from './crypto';

const CREDENTIALS_FILE = path.resolve(__dirname, '../../credentials.enc');

export class CredentialsManager {
  static saveCredentials(credentials: Record<string, string>): void {
    const encryptedData = CryptoUtil.saveCredentials(credentials);
    fs.writeFileSync(CREDENTIALS_FILE, encryptedData, 'utf8');
  }

  static loadCredentials(): Record<string, string> {
    try {
      if (!fs.existsSync(CREDENTIALS_FILE)) {
        return {};
      }
      const encryptedData = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
      return CryptoUtil.loadCredentials(encryptedData);
    } catch (error) {
      console.error('Erro ao carregar arquivo de credenciais:', error);
      return {};
    }
  }
} 