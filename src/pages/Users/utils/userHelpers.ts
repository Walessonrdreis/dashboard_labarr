import { User, UserRole, UserStatus } from '../types/User';
import { USER_ROLES, USER_STATUS } from '../constants/userConstants';

export const formatUserName = (firstName?: string, lastName?: string): string => {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.map(part => part?.trim()).join(' ');
};

export const formatDate = (date: string | undefined): string => {
  if (!date) return '';
  
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return '';
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(parsedDate);
  } catch {
    return '';
  }
};

export const validateEmail = (email?: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUser = (user: any): boolean => {
  if (!user) return false;

  // Validação dos campos obrigatórios
  if (!user.nome?.trim() || !user.email?.trim()) {
    return false;
  }

  // Validação do email
  if (!validateEmail(user.email)) {
    return false;
  }

  // Validação do cargo
  if (user.cargo && !Object.keys(USER_ROLES).includes(user.cargo)) {
    return false;
  }

  // Validação do status
  if (user.status && !Object.keys(USER_STATUS).includes(user.status)) {
    return false;
  }

  return true;
};

export const sortUsers = <T extends User>(
  users: T[],
  field: keyof T,
  direction: 'asc' | 'desc'
): T[] => {
  return [...users].sort((a, b) => {
    const valueA = String(a[field] || '').toLowerCase();
    const valueB = String(b[field] || '').toLowerCase();
    
    const comparison = valueA.localeCompare(valueB, 'pt-BR');
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const filterUsers = <T extends User>(
  users: T[],
  searchTerm?: string,
  status?: string
): T[] => {
  return users.filter(user => {
    const matchesSearch = !searchTerm || [user.nome, user.email]
      .some(field => field.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = !status || user.status === status;

    return matchesSearch && matchesStatus;
  });
};

export const formatUserRole = (role: string | undefined): string => {
  if (!role) return 'Desconhecido';
  
  const normalizedRole = role.toUpperCase();
  return USER_ROLES[normalizedRole as UserRole] || 'Desconhecido';
};

export const formatUserStatus = (status: string | undefined): string => {
  if (!status) return 'Desconhecido';
  
  const normalizedStatus = status.toUpperCase();
  return USER_STATUS[normalizedStatus as UserStatus] || 'Desconhecido';
};

export const paginateUsers = <T>(
  items: T[],
  page: number,
  limit: number
): { items: T[]; total: number; totalPages: number } => {
  const start = (page - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);
  
  return {
    items: paginatedItems,
    total: items.length,
    totalPages: Math.ceil(items.length / limit)
  };
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}; 