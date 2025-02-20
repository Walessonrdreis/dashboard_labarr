import { useState, useEffect, useCallback, useRef } from 'react';
import { User, UserFormData, UserStatus } from '../types/User';
import { userService } from '../services/userService';
import { ITEMS_PER_PAGE } from '../constants/userConstants';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | ''>('');
  const loadingRef = useRef(0);

  const startLoading = () => {
    loadingRef.current += 1;
    setIsLoading(true);
  };

  const stopLoading = () => {
    loadingRef.current -= 1;
    if (loadingRef.current <= 0) {
      loadingRef.current = 0;
      setIsLoading(false);
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      startLoading();
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
      stopLoading();
    }
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const createUser = async (userData: UserFormData): Promise<void> => {
    try {
      startLoading();
      setError(null);
      await userService.createUser(userData);
      setCurrentPage(1); // Reset para primeira página
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  };

  const updateUser = async (user: User): Promise<void> => {
    try {
      startLoading();
      setError(null);
      await userService.updateUser(user);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  };

  const deleteUser = async (userId: number): Promise<void> => {
    try {
      startLoading();
      setError(null);
      await userService.deleteUser(userId);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      stopLoading();
    }
  };

  const setPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
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