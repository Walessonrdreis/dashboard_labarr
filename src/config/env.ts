import dotenv from 'dotenv';
import path from 'path';
import { CredentialsManager } from '../utils/credentials';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  auth: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || '123456',
    secretKey: process.env.SECRET_KEY || 'chave_padrao',
  },
  env: process.env.NODE_ENV || 'development',
  api: {
    url: process.env.API_URL || 'http://localhost:3000',
    omie: {
      url: process.env.VITE_OMIE_API_URL,
      appKey: process.env.VITE_OMIE_APP_KEY,
      appSecret: process.env.VITE_OMIE_APP_SECRET,
    }
  }
};

// Salvar credenciais
const credentials = {
  ADMIN_USERNAME: 'admin',
  ADMIN_PASSWORD: '123456',
  OMIE_APP_KEY: '3830837835825',
  OMIE_APP_SECRET: '456db4ac82e0f3640075629f745fa188'
};

CredentialsManager.saveCredentials(credentials);

// Carregar credenciais
const savedCredentials = CredentialsManager.loadCredentials(); 