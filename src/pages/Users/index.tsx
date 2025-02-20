import { useState } from 'react';
import { Box, Flex, Heading, Button, useToast, useDisclosure } from '@chakra-ui/react';
import { FiUserPlus, FiSearch } from 'react-icons/fi';
import Layout from '../../components/Layout';
import UserList from './components/UserList';
import UserCard from './components/UserCard';
import SearchInput from '../../components/SearchInput';
import StatusFilter from '../../components/StatusFilter';
import UserFormModal from './components/UserFormModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import { useUsers } from './hooks/useUsers';
import { formatUserRole, formatUserStatus } from './utils/userHelpers';

const Users = () => {
  const toast = useToast();
  const {
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
    setSearchTerm,
    setStatusFilter
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState(null);
  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
  };

  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData);
      toast({
        title: 'Usuário criado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onFormClose();
    } catch (err) {
      toast({
        title: 'Erro ao criar usuário',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateUser = async (userData: any) => {
    try {
      await updateUser(userData);
      toast({
        title: 'Usuário atualizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onFormClose();
    } catch (err) {
      toast({
        title: 'Erro ao atualizar usuário',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUser.id);
      toast({
        title: 'Usuário excluído com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onDeleteClose();
      setSelectedUser(null);
    } catch (err) {
      toast({
        title: 'Erro ao excluir usuário',
        description: err.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    onFormOpen();
  };

  const handleDelete = (user: any) => {
    setSelectedUser(user);
    onDeleteOpen();
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    onFormOpen();
  };

  if (error) {
    return (
      <Layout>
        <Box p={4} bg="red.100" color="red.900" borderRadius="md">
          Erro ao carregar usuários: {error}
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={6}>
        <Flex justify="space-between" align="center" mb={6}>
          <Heading size="lg">Usuários</Heading>
          <Button
            leftIcon={<FiUserPlus />}
            colorScheme="blue"
            onClick={handleAddNew}
          >
            Adicionar Usuário
          </Button>
        </Flex>

        <Flex gap={4} mb={6}>
          <Box flex={1}>
            <SearchInput
              placeholder="Buscar usuários..."
              icon={<FiSearch />}
              onChange={handleSearch}
            />
          </Box>
          <StatusFilter
            onChange={handleStatusChange}
            options={[
              { value: '', label: 'Todos' },
              { value: 'ACTIVE', label: 'Ativo' },
              { value: 'INACTIVE', label: 'Inativo' },
              { value: 'PENDING', label: 'Pendente' }
            ]}
          />
        </Flex>

        <Box mb={6}>
          <Flex wrap="wrap" gap={4}>
            <UserCard
              title="Total de Usuários"
              count={users.length}
              colorScheme="blue"
            />
            <UserCard
              title="Usuários Ativos"
              count={users.filter(u => u.status === 'ACTIVE').length}
              colorScheme="green"
            />
            <UserCard
              title="Usuários Inativos"
              count={users.filter(u => u.status === 'INACTIVE').length}
              colorScheme="red"
            />
          </Flex>
        </Box>

        <UserList
          users={users.map(user => ({
            ...user,
            formattedRole: formatUserRole(user.cargo),
            formattedStatus: formatUserStatus(user.status)
          }))}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setPage}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <UserFormModal
          isOpen={isFormOpen}
          onClose={onFormClose}
          user={selectedUser}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          onConfirm={handleDeleteUser}
          title="Excluir Usuário"
          message={`Tem certeza que deseja excluir o usuário ${selectedUser?.nome}?`}
        />
      </Box>
    </Layout>
  );
};

export default Users; 