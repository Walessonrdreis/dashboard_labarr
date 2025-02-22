export const AUTH_TOKEN_KEY = '@DashboardLab:token';
export const USER_DATA_KEY = '@DashboardLab:user';

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'E-mail ou senha inválidos',
  REQUIRED_EMAIL: 'O e-mail é obrigatório',
  REQUIRED_PASSWORD: 'A senha é obrigatória',
  INVALID_EMAIL: 'Digite um e-mail válido',
  MIN_PASSWORD_LENGTH: 'A senha deve ter no mínimo 6 caracteres',
  SERVER_ERROR: 'Erro ao conectar com o servidor',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet',
  TOO_MANY_ATTEMPTS: 'Muitas tentativas de login. Por favor, tente novamente mais tarde.',
} as const;

export const LABELS = {
  EMAIL: 'E-mail',
  PASSWORD: 'Senha',
  LOGIN_BUTTON: 'Entrar',
  REMEMBER_ME: 'Lembrar-me',
  FORGOT_PASSWORD: 'Esqueceu a senha?',
};

export const PLACEHOLDERS = {
  EMAIL: 'Digite seu e-mail',
  PASSWORD: 'Digite sua senha',
}; 