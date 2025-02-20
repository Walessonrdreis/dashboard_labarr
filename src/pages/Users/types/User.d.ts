export interface User {
  id: number;
  nome: string;
  email: string;
  cargo: UserRole;
  status: UserStatus;
  ultimoAcesso: string;
  avatar?: string;
}

export type UserRole = 'ADMIN' | 'USER' | 'MANAGER';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING';

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  page?: number;
  limit?: number;
}

export interface UserFormData {
  nome: string;
  email: string;
  cargo: UserRole;
  status: UserStatus;
}

export interface UsersResponse {
  users: User[];
  total: number;
  totalPages: number;
}

export interface UserCardProps {
  title: string;
  count: number;
  colorScheme?: string;
}

export interface UserListProps {
  users: (User & { formattedRole: string; formattedStatus: string; })[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export interface UserSearchProps {
  onSearch: (term: string) => void;
  onStatusChange: (status: string) => void;
  isLoading?: boolean;
} 