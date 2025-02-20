import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Box,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { User } from '../../types/User';
import { LABELS } from '../../constants/userConstants';
import { formatDate } from '../../utils/userHelpers';
import LoadingSpinner from '../../../../components/common/LoadingSpinner';
import Pagination from '../../../../components/common/Pagination';
import ErrorMessage from '../../../../components/common/ErrorMessage';

interface UserListProps {
  users: (User & { formattedRole: string; formattedStatus: string; })[];
  isLoading: boolean;
  error?: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UserList = ({
  users,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}: UserListProps) => {
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!users.length) return <Box textAlign="center" py={8}>{LABELS.NO_USERS}</Box>;

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>{LABELS.NAME}</Th>
            <Th>{LABELS.EMAIL}</Th>
            <Th>{LABELS.ROLE}</Th>
            <Th>{LABELS.STATUS}</Th>
            <Th>{LABELS.LAST_ACCESS}</Th>
            <Th width="100px">{LABELS.ACTIONS}</Th>
          </Tr>
        </Thead>
        <Tbody>
          {users.map((user) => (
            <Tr key={user.id}>
              <Td data-testid="user-name">{user.nome}</Td>
              <Td>{user.email}</Td>
              <Td>{user.formattedRole}</Td>
              <Td>
                <Badge
                  colorScheme={user.status === 'ACTIVE' ? 'green' : 'red'}
                  borderRadius="full"
                  px={2}
                >
                  {user.formattedStatus}
                </Badge>
              </Td>
              <Td>{formatDate(user.ultimoAcesso)}</Td>
              <Td>
                <Tooltip label={LABELS.EDIT_USER} placement="top">
                  <IconButton
                    aria-label={LABELS.EDIT_USER}
                    icon={<FiEdit2 />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    mr={2}
                    onClick={() => onEdit(user)}
                  />
                </Tooltip>
                <Tooltip label={LABELS.DELETE_USER} placement="top">
                  <IconButton
                    aria-label={LABELS.DELETE_USER}
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => onDelete(user)}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </Box>
  );
};

export default UserList; 