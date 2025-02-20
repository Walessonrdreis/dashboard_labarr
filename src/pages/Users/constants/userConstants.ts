import { UserRole, UserStatus } from '../types/User';

export const USER_ROLES: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  USER: 'Usuário',
  MANAGER: 'Gerente'
};

export const USER_STATUS: Record<UserStatus, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
  PENDING: 'Pendente'
};

export const USER_STATUS_COLORS: Record<UserStatus, { bg: string; text: string }> = {
  ACTIVE: { bg: 'green.100', text: 'green.800' },
  INACTIVE: { bg: 'red.100', text: 'red.800' },
  PENDING: { bg: 'yellow.100', text: 'yellow.800' }
};

export const ITEMS_PER_PAGE = 10;

export const ERROR_MESSAGES = {
  LOAD_USERS: 'Erro ao carregar usuários',
  CREATE_USER: 'Erro ao criar usuário',
  UPDATE_USER: 'Erro ao atualizar usuário',
  DELETE_USER: 'Erro ao excluir usuário',
  INVALID_EMAIL: 'E-mail inválido',
  REQUIRED_FIELD: 'Campo obrigatório',
  INVALID_ROLE: 'Cargo inválido',
  INVALID_STATUS: 'Status inválido'
} as const;

export const SUCCESS_MESSAGES = {
  CREATE_USER: 'Usuário criado com sucesso',
  UPDATE_USER: 'Usuário atualizado com sucesso',
  DELETE_USER: 'Usuário excluído com sucesso'
} as const;

export const LABELS = {
  SEARCH_PLACEHOLDER: 'Buscar usuários...',
  ADD_USER: 'Adicionar Usuário',
  EDIT_USER: 'Editar Usuário',
  DELETE_USER: 'Excluir Usuário',
  CONFIRM_DELETE: 'Confirmar exclusão',
  CANCEL: 'Cancelar',
  CONFIRM: 'Confirmar',
  SAVE: 'Salvar',
  NAME: 'Nome',
  EMAIL: 'E-mail',
  ROLE: 'Cargo',
  STATUS: 'Status',
  LAST_ACCESS: 'Último acesso',
  ACTIONS: 'Ações',
  NO_USERS: 'Nenhum usuário encontrado',
  LOADING: 'Carregando...',
  PREVIOUS: 'Anterior',
  NEXT: 'Próxima',
  PAGE: 'Página'
} as const;

export const API_ENDPOINTS = {
  USERS: '/users',
  USER_BY_ID: (id: number) => `/users/${id}`
} as const; 