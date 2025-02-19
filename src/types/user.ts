export type UserStatus = 'active' | 'inactive';
export type UserRole = 'admin' | 'user' | 'manager';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastAccess: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  search?: string;
  status?: UserStatus;
  role?: UserRole;
}

export interface UserMetrics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  usersByRole: {
    [key in UserRole]: number;
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  role?: UserRole;
  status?: UserStatus;
} 