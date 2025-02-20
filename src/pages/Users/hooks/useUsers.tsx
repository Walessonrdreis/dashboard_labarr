export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const fetchUsers = useCallback(async (page: number = currentPage) => {
    try {
      startLoading();
      setError(null);
      const response = await userService.getUsers({
        page,
        limit: 10
      });
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      stopLoading();
    }
  }, [currentPage]);

  const changePage = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    await fetchUsers(page);
  };

  const createUser = async (userData: UserFormData) => {
    try {
      startLoading();
      setError(null);
      await userService.createUser(userData);
      await fetchUsers(1); // Volta para a primeira página após criar
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar usuário');
      throw err;
    } finally {
      stopLoading();
    }
  };

  const updateUser = async (user: User) => {
    try {
      startLoading();
      setError(null);
      await userService.updateUser(user);
      await fetchUsers(currentPage); // Mantém a página atual
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
      throw err;
    } finally {
      stopLoading();
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      startLoading();
      setError(null);
      await userService.deleteUser(userId);
      await fetchUsers(currentPage); // Mantém a página atual
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
      throw err;
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  return {
    users,
    isLoading,
    error,
    currentPage,
    totalPages,
    fetchUsers,
    changePage,
    createUser,
    updateUser,
    deleteUser
  };
}; 