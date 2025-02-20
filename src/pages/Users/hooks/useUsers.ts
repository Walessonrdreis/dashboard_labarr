import { useState, useEffect, useCallback } from 'react';
import { User, UserFormData, UserStatus } from '../types/User';
import { userService } from '../services/userService';
import { ITEMS_PER_PAGE } from '../constants/userConstants';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('');

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userService.getUsers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: searchTerm || undefined,
        status: statusFilter || undefined
      });

      setUsers(response.users);
      setTotalPages(response.totalPages);
    } catch (err: any) {
      setError(err.message);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData: UserFormData): Promise<void> => {
    try {
      setError(null);
      await userService.createUser(userData);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateUser = async (user: User): Promise<void> => {
    try {
      setError(null);
      await userService.updateUser(user);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const deleteUser = async (userId: number): Promise<void> => {
    try {
      setError(null);
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const setPage = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchTerm = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset para primeira página ao buscar
  };

  const handleStatusFilter = (status: UserStatus | '') => {
    setStatusFilter(status);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  };

  return {
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    setPage,
    setSearchTerm: handleSearchTerm,
    setStatusFilter: handleStatusFilter
  };
}; 