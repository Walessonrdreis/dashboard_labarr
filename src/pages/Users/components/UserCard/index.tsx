import {
  Box,
  VStack,
  Text,
  Avatar,
  Badge,
  IconButton,
  useDisclosure,
  Flex,
  Tooltip,
  Spinner,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { User } from '../../types/User';
import { LABELS } from '../../constants/userConstants';
import { formatDate, getInitials } from '../../utils/userHelpers';
import DeleteConfirmationModal from '../../../../components/common/DeleteConfirmationModal';

interface UserCardProps {
  user: User & { formattedRole: string; formattedStatus: string; };
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
  error?: string;
}

const UserCard = ({
  user,
  onEdit,
  onDelete,
  isEditing = false,
  isDeleting = false,
  error,
}: UserCardProps) => {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose
  } = useDisclosure();

  const handleDelete = () => {
    onDelete(user);
    onDeleteClose();
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      position="relative"
      bg="white"
      shadow="sm"
      transition="all 0.2s"
      _hover={{ shadow: 'md' }}
    >
      {(isEditing || isDeleting) && (
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="whiteAlpha.800"
          zIndex="1"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="lg"
        >
          <VStack>
            <Spinner size="lg" />
            <Text>{isEditing ? 'Salvando...' : 'Excluindo...'}</Text>
          </VStack>
        </Box>
      )}

      <VStack spacing={4} align="stretch">
        <Flex justify="space-between" align="center">
          <Avatar
            size="lg"
            name={user.nome}
            src={user.avatar}
            getInitials={getInitials}
          />
          <Box>
            <Tooltip label={LABELS.EDIT_USER}>
              <IconButton
                aria-label={LABELS.EDIT_USER}
                icon={<FiEdit2 />}
                size="sm"
                colorScheme="blue"
                variant="ghost"
                mr={2}
                onClick={() => onEdit(user)}
                isDisabled={isEditing || isDeleting}
              />
            </Tooltip>
            <Tooltip label={LABELS.DELETE_USER}>
              <IconButton
                aria-label={LABELS.DELETE_USER}
                icon={<FiTrash2 />}
                size="sm"
                colorScheme="red"
                variant="ghost"
                onClick={onDeleteOpen}
                isDisabled={isEditing || isDeleting}
              />
            </Tooltip>
          </Box>
        </Flex>

        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {user.nome}
          </Text>
          <Text color="gray.600">{user.email}</Text>
        </Box>

        <Flex gap={2} wrap="wrap">
          <Badge colorScheme="blue" borderRadius="full">
            {user.formattedRole}
          </Badge>
          <Badge
            colorScheme={user.status === 'ACTIVE' ? 'green' : 'red'}
            borderRadius="full"
          >
            {user.formattedStatus}
          </Badge>
        </Flex>

        <Text fontSize="sm" color="gray.500">
          {LABELS.LAST_ACCESS}: {formatDate(user.ultimoAcesso)}
        </Text>

        {error && (
          <Text color="red.500" fontSize="sm">
            {error}
          </Text>
        )}
      </VStack>

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        title={LABELS.DELETE_USER}
        message={`Tem certeza que deseja excluir o usuário ${user.nome}?`}
      />
    </Box>
  );
};

export default UserCard; 